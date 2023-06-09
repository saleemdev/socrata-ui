import { Bar } from "@ant-design/plots";

const DashGrid = ({payload}) => {
  const config = {
    data: payload.reverse(),
    isStack: true,
    xField: "value",
    yField: "business_name",
    seriesField: "type",
    label: {
      position: "middle",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };

  return (
    <div>
      <Bar {...config} />
    </div>
  );
};

export default DashGrid;
