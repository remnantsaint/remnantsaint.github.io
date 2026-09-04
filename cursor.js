document.addEventListener('mousemove', function (e) {
    let cursor = document.querySelector('.custom-cursor');
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
  });
  
  // 创建一个自定义光标元素
  let cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  // 添加样式
  const style = document.createElement('style');
  style.innerHTML = `
    .custom-cursor {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      pointer-events: none;
      transition: transform 0.1s ease;
    }
  `;
  document.head.appendChild(style);
  