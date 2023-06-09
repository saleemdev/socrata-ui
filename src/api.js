export const sampleTableData = async(payload) => {
    let res = await fetch('/sampedata.json' + payload)
    let data = await res.json();
    const content = data;
    const columns = makeColumns(content[0]);

    return { content, columns };
}
export const actualTableData = async(payload) => {
    console.log("payload" + payload);
    let res = await fetch(`https://data.kingcounty.gov/resource/f29f-zza5.json${payload}`)
    let data = await res.json();
    //Distinct Business Content
    if (!data) return {}
    const content = distinctBusinessEntities(data).map(row => {
        const inspections_done = inspectionDataByBusinessID(row.business_id, data).inspectionData.length
        return {...row, inspections_done }
    })
    const columns = makeColumns(content[0]);
    const _chartData = getBarChartData(data);
    return { content, columns, _inspections: data, _chartData };
}
export const inspectionDataByBusinessID = (business_id, data) => {
    const inspectionData = data.filter(row => row.business_id === business_id).map(k => {
        const { name, business_id, violation_record_id, inspection_result, inspection_date, description, violation_type, violation_description, grade } = k;

        return { name, business_id, violation_record_id, inspection_date, inspection_result, description, violation_type, violation_description, grade };
    })
    const columns = makeColumns(inspectionData)
    return { inspectionData, columns };
}
const distinctBusinessEntities = (data) => {
    const allBusinesses = data.map(k => {
        const { name, business_id, city, zip_code, address } = k;
        return { name, business_id, city, zip_code, address }
    })
    let jsonObject = allBusinesses.map(JSON.stringify);
    let uniqueSet = new Set(jsonObject);
    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
    return uniqueArray;
}
export const makeColumns = (data) => {
    const keys = Object.keys(data);

    const columns = keys.map(k => {

        let title = k.toUpperCase();
        let dataIndex = k.toLowerCase();
        let key = k.toLowerCase();
        return { title, dataIndex, key };
    })
    return columns;
}

export const getBarChartData = (data) => {
    const barGroups = [...new Set(data.map(k => k.business_id))].map((business_id) => {
        const inspections = inspectionDataByBusinessID(business_id, data).inspectionData;
        const business_name = inspections[0].name
        const satisfactory = inspections.filter(row => {
            return row.inspection_result === 'Satisfactory';
        }).length || 0
        const unsatisfactory = inspections.filter(row => {
            return row.inspection_result === 'Unsatisfactory';
        }).length || 0
        const incomplete = inspections.filter(row => {
            return row.inspection_result === 'Incomplete';
        }).length || 0
        return [{ business_name, type: "Satisfactory", value: satisfactory }, { business_name, type: "Unsatisfactory", value: unsatisfactory }, { business_name, type: "Incomplete", value: incomplete }]
    })

    return barGroups.flat();
}