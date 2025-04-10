import { useCallback, useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GetRowIdParams, ValueFormatterParams, themeMaterial, GridApi } from 'ag-grid-community';
import SparkLine from './SparkLine';

const myTheme = themeMaterial.withParams({ accentColor: 'red' });


interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  lastUpdated: string;
  historicPrice: number[];
}

interface WebSocketMessage {
  type: 'initial' | 'update';
  data: StockData[];
}

const StockGrid = () => {
  const gridApiRef = useRef<GridApi | null>(null);

  const onGridReady = (params: { api: GridApi }) => {
    gridApiRef.current = params.api;
  };

  const [columnDefs, setColumnDefs] = useState<ColDef<StockData>[]>([
    { field: 'symbol', headerName: 'Symbol', sort: 'asc' },
    { 
      field: 'historicPrice', 
      headerName: 'Spark line', 
      cellRenderer: (params: { data: StockData }) => <SparkLine data={params.data.historicPrice.map(Number)} />,
      valueFormatter: () => ''
    },
    { field: 'price', headerName: 'Price', valueFormatter: (params: ValueFormatterParams<StockData>) => `$${params.value.toFixed(2)}` },
    { field: 'change', headerName: 'Change', valueFormatter: (params: ValueFormatterParams<StockData>) => `$${params.value.toFixed(2)}` },
    {
      field: 'changePercent',
      headerName: 'Change %',
      valueFormatter: (params: ValueFormatterParams<StockData>) => `${params.value}%`,
      cellStyle: (params) => {
        const value = parseFloat(params.value);
        return value >= 0 ? { color: 'green' } : { color: 'red' };
      }
    },
    { field: 'volume', headerName: 'Volume', valueFormatter: (params: ValueFormatterParams<StockData>) => params.value.toLocaleString() },
    { field: 'lastUpdated', headerName: 'Last Updated', valueFormatter: (params: ValueFormatterParams<StockData>) => new Date(params.value).toLocaleTimeString() },
  ]);

  const defaultColDef: ColDef<StockData> = {
    flex: 1,
    minWidth: 100,
    filter: true,
    resizable: true,
  };

  const getRowId = useCallback((params: GetRowIdParams) => {
    return params.data.symbol;
  }, []);

  useEffect(() => {
    console.log('Opening WS');
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      if (message.type === 'initial') {
        if (gridApiRef.current) {
          gridApiRef.current.setGridOption('rowData', message.data);
        }
      } else if (message.type === 'update') {
        if (gridApiRef.current) {
          gridApiRef.current.setGridOption('rowData', message.data);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
      {/* @ts-ignore */}
      <AgGridReact<StockData>
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        maintainColumnOrder={true}
        theme={myTheme}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default StockGrid; 