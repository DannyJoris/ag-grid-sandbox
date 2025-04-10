import StockGrid from './components/StockGrid';

const App = () => {
  return (
    <div className="h-screen flex flex-col p-4">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">AG Grid Sandbox</h1>
      </header>
      <main className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
        <div className="bg-white rounded-lg p-2 col-span-2 border border-gray-200 row-span-2">
          <StockGrid />
        </div>
      </main>
    </div>
  )
}

export default App; 