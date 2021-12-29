import './App.css'
import Routes from './Routes'
import { Provider } from './providers/bee'
import 'antd/dist/antd.css'

function App() {
  return (
    <div className="App">
      <Provider>
        <Routes />
      </Provider>
    </div>
  )
}

export default App
