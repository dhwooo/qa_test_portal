import allure
import pytest

from fake_gsdk import ConnectInfo, RpcError


@allure.feature("GSDK Connect")
@allure.story("디바이스 연결 / 조회 / 해제")
@allure.issue("JIRA-101", "GSDK Connect 기본 흐름 요구사항")
@pytest.mark.mock
@pytest.mark.xray("XRAY-101")
def test_connect_list_disconnect(connect_svc):
    with allure.step("1. 초기 디바이스 목록 확인"):
        devices = connect_svc.getDeviceList()
        assert len(devices) == 2

    with allure.step("2. 로비 디바이스에 연결"):
        device_id = connect_svc.connect(ConnectInfo(ip="192.168.0.10"))
        assert device_id == 1001

    with allure.step("3. 연결 후 상태 확인"):
        devices = connect_svc.getDeviceList()
        target = next(d for d in devices if d.deviceID == device_id)
        assert target.connected is True

    with allure.step("4. 연결 해제"):
        connect_svc.disconnect([device_id])
        devices = connect_svc.getDeviceList()
        target = next(d for d in devices if d.deviceID == device_id)
        assert target.connected is False


@allure.feature("GSDK Connect")
@allure.story("도달 불가능한 디바이스 연결 실패")
@pytest.mark.mock
def test_connect_unreachable_device_fails(connect_svc):
    with allure.step("도달 불가능한 IP로 연결 시도"):
        with pytest.raises(RpcError):
            connect_svc.connect(ConnectInfo(ip="192.168.0.99"))


@allure.feature("GSDK Connect")
@allure.story("목록에 없는 신규 디바이스 자동 등록")
@pytest.mark.mock
def test_connect_new_device_registers(connect_svc):
    with allure.step("목록에 없는 IP로 연결"):
        device_id = connect_svc.connect(ConnectInfo(ip="192.168.0.55"))

    with allure.step("새 디바이스가 목록에 추가됐는지 확인"):
        devices = connect_svc.getDeviceList()
        assert any(d.deviceID == device_id for d in devices)


@allure.feature("GSDK Connect")
@allure.story("데모용 의도적 실패 케이스 (리포트에서 FAIL이 어떻게 보이는지 확인용)")
@pytest.mark.mock
def test_demo_intentional_failure(connect_svc):
    with allure.step("로비 디바이스 연결"):
        device_id = connect_svc.connect(ConnectInfo(ip="192.168.0.10"))

    with allure.step("일부러 틀린 deviceID 기대값으로 검증 (데모 목적)"):
        assert device_id == 9999, f"기대값 9999 이지만 실제로는 {device_id} 였습니다"
