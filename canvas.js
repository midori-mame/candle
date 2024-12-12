const emojiList = document.querySelectorAll('.emoji-item');
const workspace = document.getElementById('workspace');
const saveButton = document.getElementById('save-button');
const resetButton = document.getElementById('reset-button');
const fixedImage = document.getElementById('fixed-image');
const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");

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

const defaultBackgroundPosition = {
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
};

function reset(){
  const emojis = workspace.querySelectorAll(".emoji");
  emojis.forEach((emoji) => emoji.remove());

  const image = workspace.querySelector(".image");
  if (image) {
    image.style.left = defaultBackgroundPosition.left;
    image.style.top = defaultBackgroundPosition.top;
    image.style.transform = defaultBackgroundPosition.transform;
  }
}

resetButton.addEventListener("click", () => {
  reset();
});

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

document.addEventListener("DOMContentLoaded", () => {
  reset();

  const fileInput = document.getElementById("fileInput");
  const workspace = document.getElementById("workspace");

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      // 파일 로드 완료 후
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          // 이미지 비율 계산
          const aspectRatio = img.width / img.height;

          // workspace의 크기 설정
          const workspaceWidth = workspace.offsetWidth;
          const workspaceHeight = workspaceWidth / aspectRatio;

          workspace.style.width = `${workspaceWidth}px`;
          workspace.style.height = `${workspaceHeight}px`;

          // 배경 이미지 설정
          workspace.style.backgroundImage = `url(${img.src})`;
        };
      };

      reader.readAsDataURL(file);
    }
  });
});

window.addEventListener("resize", () => {
  const currentBackground = workspace.style.backgroundImage;
  if (currentBackground) {
    // 이미지 다시 로드
    const url = currentBackground.slice(5, -2); // url("...") 형식에서 URL 추출
    const img = new Image();
    img.src = url;

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const workspaceWidth = document.body.clientWidth * 0.8;
      const workspaceHeight = workspaceWidth / aspectRatio;

      workspace.style.width = `${workspaceWidth}px`;
      workspace.style.height = `${workspaceHeight}px`;
    };
  }
});

let currentScale = 1; // 초기 배율

// 확대 버튼
zoomInButton.addEventListener("click", () => {
  currentScale += 0.1; // 10% 확대
  updateImageSize();
});

// 축소 버튼
zoomOutButton.addEventListener("click", () => {
  currentScale = Math.max(0.1, currentScale - 0.1); // 10% 축소 (최소 0.1배)
  updateImageSize();
});

// 이미지 크기 업데이트
function updateImageSize() {
  fixedImage.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
}
