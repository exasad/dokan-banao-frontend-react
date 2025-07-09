import { lazy } from 'react';

const AutoComplete = lazy(() => import('./AutoComplete'));
const Checkbox = lazy(() => import('./Checkbox'));
const Cascader = lazy(() => import('./Cascader'));
const Form = lazy(() => import('./Form'));
const DatePicker = lazy(() => import('./DatePicker'));
const InputNumber = lazy(() => import('./InputNumber'));
const Input = lazy(() => import('./Input'));
const Mention = lazy(() => import('./Mention'));
const Rate = lazy(() => import('./Rate'));
const Radio = lazy(() => import('./Radio'));
const Select = lazy(() => import('./Select'));
const Slider = lazy(() => import('./Slider'));
const Switches = lazy(() => import('./Switches'));
const TreeSelect = lazy(() => import('./TreeSelect'));
const TimePicker = lazy(() => import('./TimePicker'));
const Transfer = lazy(() => import('./Transfer'));
const Upload = lazy(() => import('./Upload'));

export const dataEntryComponentConfigs = [
  {
    path: '/components/dataEntry/auto-complete',
    element: <AutoComplete />,
  },
  {
    path: '/components/dataEntry/checkbox',
    element: <Checkbox />,
  },
  {
    path: '/components/dataEntry/cascader',
    element: <Cascader />,
  },
  {
    path: '/components/dataEntry/form',
    element: <Form />,
  },
  {
    path: '/components/dataEntry/date-picker',
    element: <DatePicker />,
  },
  {
    path: '/components/dataEntry/inputnumber',
    element: <InputNumber />,
  },
  {
    path: '/components/dataEntry/input',
    element: <Input />,
  },
  {
    path: '/components/dataEntry/mention',
    element: <Mention />,
  },
  {
    path: '/components/dataEntry/rate',
    element: <Rate />,
  },
  {
    path: '/components/dataEntry/radio',
    element: <Radio />,
  },
  {
    path: '/components/dataEntry/select',
    element: <Select />,
  },
  {
    path: '/components/dataEntry/slider',
    element: <Slider />,
  },
  {
    path: '/components/dataEntry/switch',
    element: <Switches />,
  },
  {
    path: '/components/dataEntry/tree-select',
    element: <TreeSelect />,
  },
  {
    path: '/components/dataEntry/time-picker',
    element: <TimePicker />,
  },
  {
    path: '/components/dataEntry/transfer',
    element: <Transfer />,
  },
  {
    path: '/components/dataEntry/upload',
    element: <Upload />,
  },
];
