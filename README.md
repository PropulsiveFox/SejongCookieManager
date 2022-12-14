# Sejong Cookie Lifetime Manager

## 보안 경고

이 브라우저 확장 기능은 보안을 위해 만들어진 키보드 보안 요구, 자동 로그아웃 등을 무력화 하려고 합니다. 따라서 사용자는 다음의 행동 지침을 따라 보안을 챙겨야 합니다.

- 개인적으로만 사용하고 보안 잠금이 있는 장치에만 사용해야 합니다.
- 타인이 악용하지 않도록 관리해아만 합니다. 예를 들어,
  - 공공장소에서 장치를 켜놓고 자리를 비우지 않아야 합니다.
  - 타인에게 장치를 빌려준다면 본래의 사용자의 감시가 있어야 합니다.
- 필요 이상으로 긴 기간을 설정하여 쿠키를 오랜시간 저장하지 않아야 합니다.
- 이 외에도 이 확장 기능으로 생기는 보안 취약점을 항상 인지하고 적절하게 예방 하여야 합니다.

## 소개

- 로그인을 할 때 키보드 보안을 쓸지 여부를 물어보는 portal.sejong.ac.kr
- 브라우저를 다시 킬때마다 로그인을 요구하는 blackboard.sejong.ac.kr

라는 불편함들을 느껴왔기 때문에 그 불편함을 해결해줄 브라우저 확장 기능을 만들었습니다.

지금은 테스트를 매우 짧게만 했기 때문에 언제든 확장 기능이 정상적으로 작동하지 않을 수 있습니다.
또한 단기적(몇 분에서 몇 시간 정도)으로는 블랙보드에 로그인이 유지된다는 것을 확인 했으나 장기적으로 유지되는지는 모릅니다.
또한 portal.sejong.ac.kr 혹은 blackboard.sejong.ac.kr이 작동하는 방식이 조금만이라도 바뀌면 바로 정상 작동 하지 않을 것입니다. ("하드코딩" 되어있습니다.)
이 확장 기능이 불가능하도록 만드는 것은 꽤나 쉬운 일이기 때문에 언제든 이 확장 기능은 영구적으로 폐기될 가능성이 있습니다.

개인적으로 쓰려고 만든 것을 남들도 좋아하겠다 싶어 출시하는 것이기 때문에 제가 주로 사용하는 브라우저인 파이어폭스는 지원 하지만 현재 상태로는 크로미움 기반(크롬, 엣지, 웨일 등)은 지원하지 않습니다.
파이어폭스 확장 기능도 크롬 확장 기능을 기반으로 만들어진 것이기 때문에 혹시나 매우 약간의 노력 만으로 크롬에서 작동하도록 할 수 있으면 크롬도 지원하려고 했었으나 생각보다 API의 차이점과 오류가 많아서 지원을 포기했습니다.
그래서 코드를 살펴보면 크롬 확장 기능 API를 쓰려는 시도가 보이겠으나 결과적으로는 지원하지 않는 것입니다.

## 사용법

[Release](https://github.com/PropulsiveFox/SejongCookieManager/releases) 에서 최신 xpi 파일을 다운로드 합니다.
github을 신뢰할 수 있냐는 경고문이 뜨면 계속 설치하시면 됩니다.
새로운 버전이 출시된다면 자동으로 업데이트 됩니다.

확장 기능에서 항목을 원하면 그 항목을 선택하고 기간을 설정하시면 됩니다. 보안 경고 문구를 읽고 체크 해야만 설정을 저장할 수 있습니다.

## 각 기능마다 하는 일
### "키보드 보안좀 그만물어봐"
- portal.sejong.ac.kr 'chknos' 쿠키의 만료일을 변경합니다.

### "블랙보드 로그아웃 하지 마라"
- blackboard.sejong.ac.kr 'BbRouter' 쿠키의 만료일을 변경합니다.
- 블랙보드CDN과의 통신에 간섭하여 startTimer (자동 로그아웃 타이머를 시작합니다) 함수의 내용을 비워버립니다. 이미 파일이 캐싱이 되어있다면 효력이 없으니 브라우저 캐시를 삭제하여야 합니다.

### "포탈 써서 블랙보드 로그인 해줘"
- portal.sejong.ac.kr 'PO_JSESSIONID' 쿠키의 만료일을 변경합니다.
- .sejong.ac.kr 'ssotoken' 쿠키의 만료일을 변경합니다.
- 블랙보드에 들어갔는데 로그인 버튼이 보인다면 세종포탈을 사용해 자동으로 로그인을 시도합니다.
- 세종포탈 자동 로그아웃 타이머를 1분마다 다시 시작 하라는 명령을 내립니다.
