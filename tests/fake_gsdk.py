"""
GSDK 공식 Python 예제(ConnectSvc, DeviceInfo, ConnectInfo 등)의 인터페이스를 흉내낸
가짜(fake) 구현체. 실제 GSDK protobuf(connect_pb2 등)가 없어도 리포트 데모가 동작하도록
in-memory로 디바이스 상태를 흉내낸다.
"""
from dataclasses import dataclass, field
from typing import List
import time


class RpcError(Exception):
    """grpc.RpcError를 흉내낸 예외."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

    def details(self):
        return self.message


@dataclass
class DeviceInfo:
    deviceID: int
    name: str
    ip: str
    model: str
    connected: bool = False


@dataclass
class ConnectInfo:
    ip: str
    port: int = 51211
    useSSL: bool = False


class FakeConnectStub:
    """실제 connect_pb2_grpc.ConnectStub 자리를 대신하는 가짜 stub."""

    def __init__(self, seed_devices: List[DeviceInfo]):
        self._devices = {d.deviceID: d for d in seed_devices}
        self._next_id = max(self._devices, default=1000) + 1

    def GetDeviceList(self, request):
        return list(self._devices.values())

    def Connect(self, connInfo: ConnectInfo):
        time.sleep(0.05)  # 실제 네트워크 왕복을 흉내
        if connInfo.ip == "192.168.0.99":
            raise RpcError(f"UNAVAILABLE: cannot reach device at {connInfo.ip}:{connInfo.port}")

        for dev in self._devices.values():
            if dev.ip == connInfo.ip:
                dev.connected = True
                return dev.deviceID

        dev = DeviceInfo(self._next_id, "BioStation3-New", connInfo.ip, "BS3", connected=True)
        self._devices[dev.deviceID] = dev
        self._next_id += 1
        return dev.deviceID

    def Disconnect(self, deviceIDs: List[int]):
        for did in deviceIDs:
            if did in self._devices:
                self._devices[did].connected = False


class ConnectSvc:
    """공식 GSDK Python 예제의 ConnectSvc와 동일한 시그니처를 갖는 wrapper."""

    def __init__(self, stub: FakeConnectStub):
        self.stub = stub

    def getDeviceList(self):
        return self.stub.GetDeviceList(None)

    def connect(self, connInfo: ConnectInfo) -> int:
        return self.stub.Connect(connInfo)

    def disconnect(self, deviceIDs: List[int]):
        self.stub.Disconnect(deviceIDs)
