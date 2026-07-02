"""
GSDK 호출을 감싸서 요청/응답을 자동으로 Allure 리포트에 첨부하는 트레이싱 레이어.
개별 테스트 코드에는 allure.attach() 호출이 필요 없다.
"""
import dataclasses
import json
import shutil
from pathlib import Path

import allure
import pytest

from fake_gsdk import ConnectInfo, ConnectSvc, DeviceInfo, FakeConnectStub, RpcError
from event_monitor_adapter import FakeEventMonitor


def pytest_sessionfinish(session, exitstatus):
    """실행할 때마다 environment.properties / categories.json을 alluredir에 자동 배치."""
    alluredir = session.config.getoption("--alluredir", default=None)
    if not alluredir:
        return
    dest = Path(alluredir)
    dest.mkdir(parents=True, exist_ok=True)
    config_dir = Path(__file__).parent / "allure_config"
    for f in config_dir.glob("*"):
        shutil.copy(f, dest / f.name)


def _to_jsonable(obj):
    if dataclasses.is_dataclass(obj):
        return dataclasses.asdict(obj)
    if isinstance(obj, list):
        return [_to_jsonable(o) for o in obj]
    return obj


def _attach(name, payload):
    allure.attach(
        json.dumps(_to_jsonable(payload), ensure_ascii=False, indent=2, default=str),
        name=name,
        attachment_type=allure.attachment_type.JSON,
    )


class TracedConnectSvc:
    """ConnectSvc를 감싸서 모든 GSDK 호출의 요청/응답을 자동으로 Allure에 첨부한다."""

    def __init__(self, svc: ConnectSvc):
        self._svc = svc

    def getDeviceList(self):
        with allure.step("GSDK GetDeviceList 호출"):
            result = self._svc.getDeviceList()
            _attach("GetDeviceList 응답", result)
            return result

    def connect(self, connInfo: ConnectInfo):
        with allure.step(f"GSDK Connect 호출 ({connInfo.ip}:{connInfo.port})"):
            _attach("Connect 요청", connInfo)
            try:
                device_id = self._svc.connect(connInfo)
            except RpcError as e:
                allure.attach(str(e), name="Connect 에러", attachment_type=allure.attachment_type.TEXT)
                raise
            _attach("Connect 응답", {"deviceID": device_id})
            return device_id

    def disconnect(self, deviceIDs):
        with allure.step(f"GSDK Disconnect 호출 (deviceIDs={deviceIDs})"):
            self._svc.disconnect(deviceIDs)
            _attach("Disconnect 완료", {"deviceIDs": deviceIDs})


@pytest.fixture
def seed_devices():
    return [
        DeviceInfo(deviceID=1001, name="BioStation3-Lobby", ip="192.168.0.10", model="BS3"),
        DeviceInfo(deviceID=1002, name="BioEntry-W2-Gate", ip="192.168.0.11", model="BEW2"),
    ]


@pytest.fixture
def connect_svc(seed_devices):
    stub = FakeConnectStub(seed_devices)
    svc = ConnectSvc(stub)
    return TracedConnectSvc(svc)


@pytest.fixture
def event_monitor():
    """PLACEHOLDER: 실제 EventMonitor 인터페이스로 교체 예정.
    setup(start)/teardown(stop) 구간에서 캡처된 이벤트를 Allure에 자동 첨부한다 —
    print() 없이도 '무슨 이벤트가 실제로 잡혔는지'가 리포트에 그대로 남는다."""
    monitor = FakeEventMonitor()
    with allure.step("EventMonitor 시작 (setup)"):
        monitor.start()

    yield monitor

    with allure.step("EventMonitor 종료 (teardown)"):
        monitor.stop()
        events = monitor.get_events()
        _attach("캡처된 이벤트 목록", [
            {"device_id": e.device_id, "event_type": e.event_type, "timestamp": e.timestamp, "raw": e.raw}
            for e in events
        ])


@pytest.fixture(autouse=True)
def _xray_test_key(request):
    """@pytest.mark.xray("XRAY-123")가 붙은 테스트는 JUnit XML에 Xray가 요구하는
    <properties><property name="test_key" value="XRAY-123"/></properties> 를 자동으로 남긴다."""
    marker = request.node.get_closest_marker("xray")
    if marker and marker.args:
        record_property = request.getfixturevalue("record_property")
        record_property("test_key", marker.args[0])
