import { createRef, useEffect, useRef } from 'react';
/**
 *@description 鼠标事件.
 *@description 值得注意的是：.
 *@description  将infoWinRef挂在在外层div上时.
 *@description  需要将该div内的元素包一层div.
 *@description  并将这个用于包裹的div的属性设置为.
 *@description  pointer-events: none;.
 *@description  否则拖动还是存在鼠标不固定在原先位置的问题.
 *@author guoweiyu.
 *@date 2021-08-08 19:34:54.
 */
export const useMouseDragEvent = () => {
  // 记录鼠标在元素内的位置
  const infoWinRef = createRef<HTMLDivElement>();
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  let x = 0;
  let y = 0;

  const loginMouseEvent = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    x = offsetX;
    y = offsetY;
    mousePos.current = { x, y };
    infoWinRef.current &&
      infoWinRef.current.removeEventListener('mousedown', loginMouseEvent);
  };

  const loginDragStartEvent = (e: DragEvent) => {
    infoWinRef.current &&
      infoWinRef.current.addEventListener('mousedown', loginMouseEvent);
  };

  const loginDragEvent = (ev: DragEvent) => {
    if (!infoWinRef.current) return;
    const { offsetX, offsetY } = ev;
    const { left, top } = infoWinRef.current!.style;
    // const { width, height } = infoWinRef.current!.getBoundingClientRect();
    const newLeft = +left.slice(0, -2) + offsetX;
    const newTop = +top.slice(0, -2) + offsetY;
    const { x, y } = mousePos.current;
    infoWinRef.current.style.left = `${newLeft - x}px`;
    infoWinRef.current.style.top = `${newTop - y}px`;
  };

  /**
   * @description 注册鼠标拖拽事件.
   * @param {paramType} paramName - paramDescription.
   * @return {void} .
   */
  const loginDragableOperation = () => {
    if (infoWinRef.current) {
      infoWinRef.current.addEventListener('mousedown', loginMouseEvent);
      // infoWinRef.current.addEventListener('dragstart', loginDragStartEvent);
      // infoWinRef.current.addEventListener('drag', loginDragEvent);
      infoWinRef.current.addEventListener('dragend', loginDragEvent);
    }
  };

  /**
   * @description 取消鼠标拖拽事件.
   * @param {paramType} paramName - paramDescription.
   * @return {void}.
   */
  const signoutDragableOperation = () => {
    if (!infoWinRef.current) return;

    infoWinRef.current.addEventListener('mousedown', loginMouseEvent);
    // infoWinRef.current.removeEventListener('dragstart', loginDragStartEvent);
    // infoWinRef.current.removeEventListener('drag', loginDragEvent);
    infoWinRef.current.removeEventListener('dragend', loginDragEvent);
  };

  // 为弹窗注册拖拽事件
  useEffect(() => {
    if (infoWinRef.current) {
      loginDragableOperation();
      return () => signoutDragableOperation();
    }
  }, [infoWinRef]);

  return {
    infoWinRef,
    loginDragableOperation,
    signoutDragableOperation,
  };
};
