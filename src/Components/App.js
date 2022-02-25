import Table from './Table.js';

function App() {
  return (
    <div className="App">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <header className="p-8">
            <h1 className="text-2xl font-bold leading-tight ">
              Agenda
            </h1>
          </header>
          <Table></Table>
        </div>
      </div>
    </div>
  );
}

export default App;
