import ThreeFiber from '../views/threeFiber';

import Twod from '../views/threeFiber/twod';
import PlanGeometry from '../views/threeFiber/twod/PlanGeometry';

export const homeTwodRoute = {
  path: '/home/threeFiber/twod',
  component: Twod,
  name: Twod.name,
  title: '二维图形',
  routes: [
    {
      path: '/home/threeFiber/twod/PlanGeometry',
      exact: true,
      component: PlanGeometry,
      name: 'PlanGeometry',
    },
  ],
};

const ThreeFiberRoute = {
  component: ThreeFiber,
  path: '/home/threeFiber',
  title: 'React Three Fiber',
  routes: [homeTwodRoute],
};

export default ThreeFiberRoute;