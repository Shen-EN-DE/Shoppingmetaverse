import { useAccount } from 'wagmi'

export function Account() {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <div>
      <div>
        目前帳號地址：{accountData?.ens?.name ?? accountData?.address}
        {accountData?.ens ? ` (${accountData?.address})` : null}
      </div>
      <button onClick={() => disconnect()}>
        Disconnect from {accountData?.connector?.name}
      </button>

      {accountData?.ens?.avatar && (
        <img src={accountData.ens.avatar} style={{ height: 40, width: 40 }} />
      )}
    </div>
  )
}
