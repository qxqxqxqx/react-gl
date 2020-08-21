/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-21 10:55:31
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-21 16:29:51
 * @Description: 初始化以及消除副作用HOC
 */
import React, { Component } from "react";
import * as dat from 'dat.gui';

export interface State {}
type StateKeys = keyof State;

export interface Props extends State {
  changeAnimationId: (id: number) => void
}

// TODO: complete type
export function IRHoc<C extends object>(WrappedComponent: React.ComponentClass<C>): any {

  return class WithIR extends Component<any, State> {
    private animationId: number | null;
    private gui: dat.GUI;
    public constructor(props: any) {
      super(props);
      this.state = {}
      this.gui = new dat.GUI();
      this.animationId = null;
    }

    /**
     * remove gui & animation
     */
    public componentWillUnmount() {
      this.gui.destroy();
      this.animationId && cancelAnimationFrame(this.animationId);
    }

    /**
     * @param {type} 
     * @return {void} 
     * @description: change state 
     */
    public changeState = <K extends StateKeys>(key: StateKeys, value: State[K]) => {
      this.setState({
        [key]: value
      } as Pick<State, K>)
    }

    /**
     * @param {type} 
     * @return {type} 
     * @description: change animationId
     */
    public changeAnimationId = (id: number): void => {
      this.animationId = id;
    }

    render() {
      const props = { gui: this.gui, changeAnimationId: this.changeAnimationId }
      return <WrappedComponent {...props as C} />
    }

  }

}