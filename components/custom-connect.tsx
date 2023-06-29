import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
export const CustomConnectButton = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');
                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button onClick={openConnectModal} className='py-0 h-8' >
                                        <Wallet className="mr-2 h-4 w-4" />
                                        Connect Wallet
                                    </Button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <Button onClick={openChainModal} className='py-0 h-8' >
                                        Wrong network
                                    </Button>
                                );
                            }
                            return (
                                <div >
                                    <Button size="sm" onClick={openAccountModal} className='py-0 h-8'>
                                        <Wallet className="mr-2 h-4 w-4" />
                                        {account.displayName}
                                    </Button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};