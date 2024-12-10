const emojiList = document.querySelectorAll('.emoji-item');
const workspace = document.getElementById('workspace');
const saveButton = document.getElementById('save-button');

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

    element.addEventListener('mousedown', (e) => {
    isDragging = true;
    const offsetX = e.clientX - element.offsetLeft;
    const offsetY = e.clientY - element.offsetTop;

    const moveElement = (moveEvent) => {
        if (!isDragging) return;
        element.style.left = `${moveEvent.clientX - offsetX}px`;
        element.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const stopDragging = () => {
        isDragging = false;
        document.removeEventListener('mousemove', moveElement);
        document.removeEventListener('mouseup', stopDragging);
    };

    document.addEventListener('mousemove', moveElement);
    document.addEventListener('mouseup', stopDragging);
    });
}

// 고정된 이미지 드래그 가능하게 설정
const fixedImage = document.querySelector('.image');

// 저장 버튼 클릭 시 workspace를 이미지로 저장
saveButton.addEventListener('click', () => {
    
    html2canvas(workspace, { useCORS: true }).then((canvas) => {
    const link = document.createElement('a');
    link.download = 'your_candle.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    });
});