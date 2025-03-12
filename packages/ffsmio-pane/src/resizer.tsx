import {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { usePane } from "./use-pane";

export interface ResizerProps {
  index: number;
  min?: number;
  max?: number;
}

export function Resizer(props: ResizerProps) {
  const { index, min, max } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pane = usePane();
  const item = useMemo(() => pane.items[index], [pane.items, index]);

  const dragging = useRef(false);
  const startSize = useRef(pane.horizontal ? item?.height : item?.width);
  const startPoint = useRef<number | undefined>(undefined);

  const style = useMemo(() => {
    const rs: CSSProperties = {
      backgroundColor: pane.resizeColor,
    };

    if (pane.horizontal) {
      rs.height = pane.resizeSize;
    } else {
      rs.width = pane.resizeSize;
    }

    if (isHovered) {
      rs.backgroundColor = pane.resizeHoverColor;
    }

    if (isDragging) {
      rs.backgroundColor = pane.resizeActiveColor;
    }

    return rs;
  }, [
    pane.horizontal,
    pane.resizeSize,
    pane.resizeColor,
    pane.resizeHoverColor,
    pane.resizeActiveColor,
    isHovered,
    isDragging,
  ]);

  const handleMouseUp = () => {
    dragging.current = false;
    startPoint.current = undefined;
    startSize.current = pane.horizontal ? item?.height : item?.width;
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (startPoint.current === undefined || !dragging.current || !item) {
      return;
    }

    let itemWidth = item.width, itemHeight = item.height;

    if (pane.horizontal) {
      itemHeight = Math.min(
        Math.max(
          startSize.current! + e.clientY - startPoint.current,
          min || 0,
        ),
        max || pane.containerHeight,
      );
    } else {
      itemWidth = Math.min(
        Math.max(
          startSize.current! + e.clientX - startPoint.current,
          min || 0,
        ),
        max || pane.containerWidth,
      );
    }

    pane.updateItemSize(index, itemWidth, itemHeight);
  };

  useEffect(() => {
    if ('undefined' === typeof window || !isDragging) {
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    dragging.current = true;
    startSize.current = pane.horizontal ? item?.height : item?.width;
    startPoint.current = pane.horizontal ? e.clientY : e.clientX;
  };

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  return (
    <div
      className="Pane-resizer"
      style={style}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  );
}