/**
 *@description 传感器弹窗.
 *@author guoweiyu.
 *@date 2021-08-08 17:56:44.
 */
import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  useCallback,
} from 'react';
import styles from './index.less';
import { Object3D } from 'three';
import { SensorDataType } from '@/pages/shenyang-demo/types/paramTypes';
import LineDiagram from '@/pages/shenyang-demo/components/diagrams/LineDiagram';
import { useMouseDragEvent } from '@/pages/shenyang-demo/utils/mouse';

interface SensorDetailProps {
  sensor?: SensorDataType;
  amplitude?: number;
  isPlay?: boolean;
}

const SensorDetail: React.FC<SensorDetailProps> = props => {
  const { sensor, isPlay = true } = props;
  const [sensorData, setSensorData] = useState<{
    name: string;
    type: string;
    [key: string]: string;
  }>();
  const amplitude = useRef<number>(10);
  const { infoWinRef } = useMouseDragEvent();
  const randomType = useRef<number>(Math.random() - 0.5);

  useEffect(() => {
    if (sensor) {
      randomType.current = Math.random() - 0.5;
      const { name, clientX, clientY } = sensor;
      const data = {
        name,
        type: randomType.current > 0 ? '加速度传感器' : '应变传感器',
      };
      setSensorData(data);
      // 将窗口移动至鼠标处
      if (infoWinRef.current) {
        infoWinRef.current!.style.left = `${clientX}px`;
        infoWinRef.current!.style.top = `${clientY}px`;
      }
    }
  }, [sensor, setSensorData]);

  return (
    <div
      className={styles.container}
      ref={infoWinRef}
      style={{
        zIndex: sensor ? 12 : -99,
        opacity: sensor ? 1 : 0,
      }}
      draggable="true"
    >
      <div className={styles.itemContainer}>
        {/* { sensorData && Object.keys(sensorData).map((key) => {
          return (
            <div className={styles.item} key={key}>
              <div>{sensorData[key]}: &nbsp;</div>{' '}
              <div>{}</div>
            </div>
          );
        })} */}
        <div className={styles.item}>
          <div>{sensorData?.name}:</div>&nbsp;&nbsp;
          <div>{sensorData?.type}</div>
        </div>
        <div className={styles.diagram}>
          <LineDiagram
            type={randomType.current > 0 ? '加速度图' : '应变图'}
            clock={isPlay}
            selectedBtn={sensorData}
            amplitude={amplitude}
          />
        </div>
        <div className={styles.diagramLegend}>
          {randomType.current > 0 ? '加速度图' : '应变图'}
        </div>
      </div>
    </div>
  );
};

export default SensorDetail;
