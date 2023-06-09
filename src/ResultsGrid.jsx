import { Button, Table, Input, Modal, Tag } from "antd";
// import React from "react";
import { useQuery } from "react-query";
import { actualTableData, makeColumns } from "./api";
import DashGrid from "./DashGrid";
import { useState } from "react";
const { Search } = Input;

const ResultsGrid = () => {
  let [payload, setPayload] = useState("");
  const [open, setOpen] = useState(false);
  const [inspections, setInspections] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState("");

  //   const [payload,setPayload] = useState("");
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["actualData", payload || ""],
    queryFn: () => actualTableData(payload),
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const defaultKeys = {
    title: "",
    dataIndex: "operation",
    render: (_, record) => (
      // <a> Show Inspections </a>
      <Button
        type="dashed"
        size="large"
        onClick={() => {
          const filteredInspections = data._inspections
            ?.filter((r) => r.business_id === record.business_id)
            .map((inspection) => {
              let {
                violation_record_id,
                inspection_date,
                inspection_result,
                description,
                violation_type,
                violation_description,
                grade,
              } = inspection;
              const violation_tag = (
                <>
                  {violation_description || "n/a"}
                  <br />
                  <Tag color={(violation_type || "green").toLowerCase()}>
                    Grade :{grade}
                  </Tag>
                </>
              );
              //
              const record_id = violation_record_id || "-";
              return {
                record_id,
                inspection_date,
                inspection_result,
                description,
                violation_tag,
              };
            });

          // console.log(filteredInspections)
          setSelectedBusiness((prevState) => record.name);
          setInspections((prevState) => filteredInspections);
          setOpen((prevState) => !open);
        }}
      >
        Show Inspections
      </Button>
    ),
  };
  const onSearch = (value) => {
    setPayload(`?zip_code=${value}`);
    refetch();
  };
  //name, zip_code, and inspection_result

  return (
    <>
      <Modal
        title={`Inspection List:-${selectedBusiness}`}
        centered
        style={{
          top: 20,
        }}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <InspectionsModal inspections={inspections} />
        {/* {JSON.stringify(inspections)} */}
      </Modal>
      <div className="container">
        {data ? (
          <>
            {/* {JSON.stringify(data._chartData)} */}
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              style={{
                width: 200,
              }}
            />
            <DashGrid payload={data._chartData} />
            <Table
              dataSource={data.content}
              columns={[...data.columns, defaultKeys]}
            />
          </>
        ) : (
          "Nothing to show"
        )}
        ;
      </div>
    </>
  );
};

const InspectionsModal = ({ inspections }) => {
  return (
    <>
      <InspectionSummary inspections={inspections} />
      <br />
      <Table dataSource={inspections} columns={makeColumns(inspections[0])} />
    </>
  );
};
const InspectionSummary = ({ inspections }) => {
  const inspectionCount = (inspectionResult) => {
    return (
      inspections.filter((row) => {
        return row.inspection_result === inspectionResult;
      }).length || 0
    );
  };
  return (
    <>
      <Tag color="green">Satisfactory :{inspectionCount("Satisfactory")}</Tag>
      <Tag color="red">Unsatisfactory :{inspectionCount("Unsatisfactory")}</Tag>
      <Tag color="blue">Incomplete :{inspectionCount("Incomplete")}</Tag>
      <Tag color="purple">Complete :{inspectionCount("Complete")}</Tag>
      <h5>
        <b>Total: {inspections.length || 0}</b>
      </h5>
    </>
  );
};
export default ResultsGrid;
