import Header from "./layout/Header"
import Sidebar from "./layout/Sidebar"
import MainSection from "./MainSection"

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        {/* Notes area */}
        <MainSection />
      </div>
    </div>
  )
}

export default App
