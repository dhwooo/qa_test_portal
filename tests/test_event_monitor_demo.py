"""event_monitor 픽스처(tests/event_monitor_adapter.py, PLACEHOLDER) 데모.
실제 EventMonitor 코드로 교체되면 이 테스트 구조는 그대로 두고 fixture 내부만 바뀐다."""
import allure
import pytest

from fake_gsdk import ConnectInfo


@allure.feature("EventMonitor")
@allure.story("디바이스 인증 이벤트 캡처 (PLACEHOLDER 인터페이스)")
@pytest.mark.mock
def test_finger_auth_event_captured(connect_svc, event_monitor):
    with allure.step("디바이스 연결"):
        device_id = connect_svc.connect(ConnectInfo(ip="192.168.0.10"))

    with allure.step("지문 인증 이벤트 발생 (시뮬레이션)"):
        event_monitor.simulate_event(device_id, "FINGER_AUTH_SUCCESS", user_id="U-2001", score=87)

    with allure.step("도어 오픈/클로즈 이벤트 발생 (시뮬레이션)"):
        event_monitor.simulate_event(device_id, "DOOR_OPEN", trigger="auth_success")
        event_monitor.simulate_event(device_id, "DOOR_CLOSE", trigger="timeout")

    with allure.step("캡처된 이벤트 수 검증"):
        assert len(event_monitor.get_events()) == 3
