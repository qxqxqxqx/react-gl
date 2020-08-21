/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-21 17:27:34
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 17:37:01
 * @Description: 取消animation
 */
import {useEffect} from 'react';

export default function cancelAnimation(id: number) {
  let animationId: number | null = null;
  useEffect(() => {
    animationId = id;
    return () => {
      animationId && cancelAnimationFrame(animationId);
    };
  }, []);
}
