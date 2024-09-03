import Header from "./Header"
import MainSection from "./MainSection"
import Sidebar from "./Sidebar"

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
