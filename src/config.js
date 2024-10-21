const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS ?? 'PUBLIC_CONTRACT_ADDRESS';
const providerUrl = process.env.REACT_APP_PROVIDER_URL ?? 'PUBLIC_PROVIDER_URL';
const privateKey = process.env.REACT_APP_PRIVATE_KEY ?? 'PUBLIC_PRIVATE_KEY';

export const config = {
    contractAddress,
    providerUrl,
    privateKey
}