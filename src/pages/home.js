import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Account, Connect, NetworkSwitcher } from '../components/index'
import Landing from '../components/landing/landing';


const Home = () => {
  const { data } = useAccount()

  return (
    <>
      <Landing />

      {data?.address && (
        <>
          {/* <Account /> */}
          <NetworkSwitcher />
        </>
      )}
    </>
  )
}

export default Home
