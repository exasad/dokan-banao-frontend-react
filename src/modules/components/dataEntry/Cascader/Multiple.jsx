import { Cascader } from 'antd';

const options = [
  {
    label: 'Light',
    value: 'light',
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
];

const onChange=(value)=> {
  console.log(value);
}

const Multiple = () => {
  return (
    <Cascader
      style={{ width: 233 }}
      options={options}
      onChange={onChange}
      multiple
      maxTagCount='responsive'
    />
  );
};

export default Multiple;
