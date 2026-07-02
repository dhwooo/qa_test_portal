"""
⚠️ PLACEHOLDER — 실제 EventMonitor 인터페이스를 아직 전달받지 못해서 임의로 만든 자리다.

실제 프로젝트에 이미 "EventMonitor로 이벤트를 캡처하고 setup/teardown을 활용하는" 테스트 코드가
있다고 했으므로, 이 파일의 목적은 그 실제 클래스를 대체하는 게 아니라 —
"이벤트 캡처 결과를 Allure에 자동으로 남기는 자리"를 미리 잡아두는 것이다.

실제 EventMonitor 코드를 받으면 할 일은 아래 두 가지뿐이다:
  1. FakeEventMonitor를 실제 EventMonitor import로 교체
  2. TracedEventMonitor 안에서 실제 EventMonitor가 이벤트를 어떤 자료구조로 주는지에 맞춰
     _to_jsonable() 변환 부분만 조정

즉 GSDK 쪽에서 fake_gsdk.py -> conftest.py의 TracedConnectSvc로 감쌌던 것과 동일한 패턴이다.
"""
import time
from dataclasses import dataclass, field
from typing import List


@dataclass
class DeviceEvent:
    """실제 EventMonitor가 주는 이벤트 형태는 다를 것이다 — 지금은 추측으로 채운 자리."""
    device_id: int
    event_type: str  # 예: "FINGER_AUTH_SUCCESS", "DOOR_OPEN", "DOOR_CLOSE"
    timestamp: float
    raw: dict = field(default_factory=dict)


class FakeEventMonitor:
    """실제 EventMonitor를 흉내낸 가짜 구현. start()/stop()으로 캡처 구간을 잡고,
    그 사이에 발생한 이벤트를 get_events()로 꺼내는 구조라고 '가정'했다 — 실제와 다를 수 있다."""

    def __init__(self):
        self._running = False
        self._events: List[DeviceEvent] = []

    def start(self):
        self._running = True
        self._events = []

    def stop(self):
        self._running = False

    def simulate_event(self, device_id: int, event_type: str, **raw):
        """실제 하드웨어라면 자동으로 들어올 이벤트를, 데모를 위해 수동으로 밀어넣는다."""
        if not self._running:
            raise RuntimeError("EventMonitor가 start() 되지 않았다")
        self._events.append(DeviceEvent(device_id=device_id, event_type=event_type,
                                         timestamp=time.time(), raw=raw))

    def get_events(self) -> List[DeviceEvent]:
        return list(self._events)
