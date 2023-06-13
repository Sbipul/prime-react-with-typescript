import { FC, useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable'
interface Food{
  id:number,
  food_item_id:number,
  food_item:{},
  size_list:[{}]
}

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
  food_list?: Food[];
}
const Table:FC = () => {
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
  const toast = useRef<Toast>(null);
  const [products2,setProducts2] = useState<Product[]>([]) 
  useEffect(() => {
    const getProducts = async()=>{
      const res = await fetch("https://corerest.selopian.us/api/order?page=0&size=1100&filters=[[%22order_status_id%22,%22like%22,1]]",{
        method:'GET',
        headers:{
          'Authorization':'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsInVzZXJuYW1lIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZXMiOlsiQWRtaW4iXSwiaWF0IjoxNjg2NjUzMTIzLCJleHAiOjE2ODcwODUxMjMsImp0aSI6ImI2MTEzM2E5LTI4NTEtNDFlZS05ZTc0LTZjOTZhYmNjZWU3NiJ9.Q8oFNrtsJo7SDLj-__ONjPpG3n4WV7FISmRDK5FDBdyycsNaXBgKXQK3cSMZynTr72Skqy_buVp3LyYfNrq5Jv3fjOZHlsV1AI0hxcfpwmeY0SvIeyTyNf98QLNta3Zed7fDppMzISiXhWSlNGTdjGXFyopizhOOCTJ7eWkpOcz0k8vqaeGRVxKJAFa-q5-4pcPHN__rnaTsB02uiAxA89TUfvunaT_vhjGqxTFYL4unt05-zd3cwZNjcOkgk_17zIHkfOQ8CZ0CdESmhx1CBFiJUwVtZKl9OTMW084sQ5lVr4xx4GUgQF92s1TDctiRsmDGmh8J3srwGkrvkg7ZeA'
        }
      })
      const resData = await res.json()
      setProducts2(resData.data.items)
    }
    getProducts()
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const expandAll = () => {
      let _expandedRows: DataTableExpandedRows = {};

      products2.forEach((p) => (_expandedRows[`${p.id}`] = true));

      setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
      setExpandedRows(undefined);
  };



  const allowExpansion = (rowData: Product) => {
      return rowData.food_list!?.length > 0;
  };

  const rowExpansionTemplate = (data: Product) => {
    console.log("my data------------->",data)
      return (
          <div className="p-3">
              {/* <h5>Orders for {data.name}</h5> */}
              <DataTable value={data.food_list}>
                  <Column field="food_item_id" header="Food item id" sortable></Column>
                  <Column field="order_id" header="Order id" sortable></Column>
              </DataTable>
          </div>
      );
  };

  const header = (
      <div className="flex flex-wrap justify-content-end gap-2">
          <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
          <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
      </div>
  );

  return (
      <div className="card">
          <Toast ref={toast} />
          <DataTable value={products2} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                 rowExpansionTemplate={rowExpansionTemplate}
                  dataKey="id" header={header} tableStyle={{ minWidth: '60rem' }}>
              <Column expander={allowExpansion} style={{ width: '5rem' }} />
              <Column field="net_payable" header="net_payable" sortable />
          </DataTable>
      </div>
  );
}

export default Table