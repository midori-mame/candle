const emojiList = document.querySelectorAll('.emoji-item');
const workspace = document.getElementById('workspace');
const saveButton = document.getElementById('save-button');
const fixedImage = document.getElementById('fixed-image');

// 이모지 추가 및 드래그 기능
emojiList.forEach((emoji) => {
    emoji.addEventListener('click', () => {
    const newEmoji = document.createElement('div');
    newEmoji.textContent = emoji.textContent;
    newEmoji.classList.add('emoji');
    newEmoji.style.left = '50%';
    newEmoji.style.top = '50%';
    workspace.appendChild(newEmoji);

    enableDrag(newEmoji);
    });
});

// 드래그 기능 활성화
function enableDrag(element) {
  let isDragging = false;
  let offsetX, offsetY;

  const onStart = (e) => {
    e.preventDefault();
    isDragging = true;

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - element.offsetLeft;
    offsetY = clientY - element.offsetTop;

    // 이벤트 리스너 추가
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  };

  const onMove = (e) => {
    if (!isDragging) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    element.style.left = `${clientX - offsetX}px`;
    element.style.top = `${clientY - offsetY}px`;
  };

  const onEnd = () => {
    isDragging = false;

    // 이벤트 리스너 제거
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
  };

  // 마우스 및 터치 이벤트 리스너
  element.addEventListener('mousedown', onStart);
  element.addEventListener('touchstart', onStart, { passive: false });
}

enableDrag(fixedImage);

// 저장 버튼 클릭 시 workspace를 이미지로 저장
saveButton.addEventListener('click', () => {
    
    html2canvas(workspace, { useCORS: true }).then((canvas) => {
    const link = document.createElement('a');
    link.download = 'your_candle.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    });
});
