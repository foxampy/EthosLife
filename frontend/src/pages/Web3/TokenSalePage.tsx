import React, { useState } from 'react';
import { Coins, DollarSign, Clock, CheckCircle2, AlertCircle, ArrowRight, Gift } from 'lucide-react';
import { NeuCard } from '../../components/Neumorphism/NeuCard';
import { NeuButton } from '../../components/Neumorphism/NeuButton';
import { NeuInput } from '../../components/Neumorphism/NeuInput';
import { WalletConnectButton } from '../../components/Web3/WalletConnectButton';
import { useWeb3 } from '../../web3/hooks/useWeb3';
import { useTokenSale, SaleRound } from '../../web3/hooks/useTokenSale';

const RoundCard: React.FC<{
  round: SaleRound;
  info: {
    price: number;
    allocation: string;
    sold: string;
    minPurchase: string;
    maxPurchase: string;
    active: boolean;
    remaining: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}> = ({ round, info, isSelected, onSelect }) => {
  const progressPercent = (parseFloat(info.sold) / parseFloat(info.allocation)) * 100;
  
  const roundNames: Record<SaleRound, string> = {
    seed: 'Seed Round',
    private: 'Private Round',
    public: 'Public Round',
  };

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-3xl p-6 transition-all duration-300 ${
        isSelected
          ? 'bg-[#e4dfd5] shadow-[inset_8px_8px_16px_rgba(44,40,34,0.15),inset_-8px_-8px_16px_rgba(255,255,255,0.6)]'
          : 'bg-[#e4dfd5] shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)] hover:shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)]'
      } ${!info.active && 'opacity-60'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-[#5c5243]">{roundNames[round]}</h3>
          <p className="text-sm text-[#8c7a6b]">
            ${info.price.toFixed(3)} per UNITY
          </p>
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#8c7a6b]">Allocation:</span>
          <span className="font-medium text-[#5c5243]">
            {parseFloat(info.allocation).toLocaleString()} UNITY
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8c7a6b]">Sold:</span>
          <span className="font-medium text-[#5c5243]">
            {parseFloat(info.sold).toLocaleString()} UNITY
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8c7a6b]">Remaining:</span>
          <span className="font-medium text-[#5c5243]">
            {parseFloat(info.remaining).toLocaleString()} UNITY
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8c7a6b]">Min/Max:</span>
          <span className="font-medium text-[#5c5243]">
            {parseFloat(info.minPurchase).toLocaleString()} / {parseFloat(info.maxPurchase).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-[#d4cfc5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-[#8c7a6b]">{progressPercent.toFixed(1)}% Sold</span>
        {info.active ? (
          <span className="text-xs font-medium text-green-600">Active</span>
        ) : (
          <span className="text-xs font-medium text-amber-600">Inactive</span>
        )}
      </div>
    </div>
  );
};

export const TokenSalePage: React.FC = () => {
  const { isConnected } = useWeb3();
  const { 
    rounds, 
    purchases, 
    vestingProgress, 
    buyTokens, 
    claimTokens, 
    calculateCost,
    isLoading 
  } = useTokenSale();
  
  const [selectedRound, setSelectedRound] = useState<SaleRound>('seed');
  const [amount, setAmount] = useState('');
  const [paymentToken, setPaymentToken] = useState<'usdc' | 'usdt'>('usdc');
  const [estimatedCost, setEstimatedCost] = useState('0');

  const handleAmountChange = async (value: string) => {
    setAmount(value);
    if (value && rounds) {
      const cost = await calculateCost(selectedRound, value);
      setEstimatedCost(cost);
    } else {
      setEstimatedCost('0');
    }
  };

  const handleRoundChange = async (round: SaleRound) => {
    setSelectedRound(round);
    if (amount && rounds) {
      const cost = await calculateCost(round, amount);
      setEstimatedCost(cost);
    }
  };

  const handleBuy = async () => {
    if (!amount) return;
    await buyTokens(selectedRound, amount, paymentToken);
    setAmount('');
    setEstimatedCost('0');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#e4dfd5] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#e4dfd5] shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)] flex items-center justify-center">
              <Coins className="w-12 h-12 text-[#5c5243]" />
            </div>
            <h1 className="text-3xl font-bold text-[#5c5243] mb-4">UNITY Token Sale</h1>
            <p className="text-[#8c7a6b] mb-8 max-w-md mx-auto">
              Connect your wallet to participate in the UNITY token sale
            </p>
            <WalletConnectButton size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e4dfd5] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#5c5243]">UNITY Token Sale</h1>
            <p className="text-[#8c7a6b]">Purchase UNITY tokens with USDC or USDT</p>
          </div>
          <WalletConnectButton />
        </div>

        {/* Vesting Progress */}
        {vestingProgress && parseFloat(vestingProgress.totalPurchased) > 0 && (
          <NeuCard className="p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[#5c5243]" />
              <h2 className="text-xl font-bold text-[#5c5243]">Your Vesting Progress</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b]">Total Purchased</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingProgress.totalPurchased} UNITY</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b]">Claimable Now</p>
                <p className="text-xl font-bold text-green-600">{vestingProgress.claimable} UNITY</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b]">Already Claimed</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingProgress.claimed} UNITY</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-[#8c7a6b]">Vesting Progress</p>
                <p className="text-xl font-bold text-[#5c5243]">{vestingProgress.progressPercent.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="w-full h-3 rounded-full bg-[#d4cfc5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] mb-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] transition-all duration-500"
                style={{ width: `${vestingProgress.progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-[#8c7a6b] mb-4">
              <span>Purchase: {new Date(vestingProgress.vestingStart).toLocaleDateString()}</span>
              <span>Cliff: {new Date(vestingProgress.cliffEnd).toLocaleDateString()}</span>
              <span>Fully Vested: {new Date(vestingProgress.vestingEnd).toLocaleDateString()}</span>
            </div>

            {parseFloat(vestingProgress.claimable) > 0 && (
              <NeuButton onClick={claimTokens} className="w-full" size="lg">
                <Gift className="w-5 h-5 mr-2" />
                Claim {vestingProgress.claimable} UNITY
              </NeuButton>
            )}
          </NeuCard>
        )}

        {/* Sale Rounds */}
        {rounds && (
          <>
            <h2 className="text-xl font-bold text-[#5c5243] mb-4">Select Round</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <RoundCard
                round="seed"
                info={rounds.seed}
                isSelected={selectedRound === 'seed'}
                onSelect={() => handleRoundChange('seed')}
              />
              <RoundCard
                round="private"
                info={rounds.private}
                isSelected={selectedRound === 'private'}
                onSelect={() => handleRoundChange('private')}
              />
              <RoundCard
                round="public"
                info={rounds.public}
                isSelected={selectedRound === 'public'}
                onSelect={() => handleRoundChange('public')}
              />
            </div>

            {/* Purchase Form */}
            <NeuCard className="p-6 mb-8">
              <h2 className="text-xl font-bold text-[#5c5243] mb-6">Purchase Tokens</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-[#8c7a6b] mb-2 block">
                    Amount (UNITY)
                  </label>
                  <NeuInput
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                  />
                  <p className="text-xs text-[#8c7a6b] mt-2">
                    Min: {parseFloat(rounds[selectedRound].minPurchase).toLocaleString()} | 
                    Max: {parseFloat(rounds[selectedRound].maxPurchase).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-[#8c7a6b] mb-2 block">
                    Payment Token
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setPaymentToken('usdc')}
                      className={`flex-1 p-4 rounded-2xl transition-all ${
                        paymentToken === 'usdc'
                          ? 'bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]'
                          : 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)]'
                      }`}
                    >
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-[#5c5243]" />
                      <p className="font-medium text-[#5c5243]">USDC</p>
                    </button>
                    <button
                      onClick={() => setPaymentToken('usdt')}
                      className={`flex-1 p-4 rounded-2xl transition-all ${
                        paymentToken === 'usdt'
                          ? 'bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]'
                          : 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)]'
                      }`}
                    >
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-[#5c5243]" />
                      <p className="font-medium text-[#5c5243]">USDT</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {amount && parseFloat(amount) > 0 && (
                <div className="mt-6 p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#8c7a6b]">You will pay:</span>
                    <span className="font-bold text-[#5c5243]">
                      {parseFloat(estimatedCost).toFixed(2)} {paymentToken.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#8c7a6b]">You will receive:</span>
                    <span className="font-bold text-[#5c5243]">
                      {parseFloat(amount).toLocaleString()} UNITY
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8c7a6b]">Price per token:</span>
                    <span className="font-medium text-[#5c5243]">
                      ${rounds[selectedRound].price.toFixed(3)}
                    </span>
                  </div>
                </div>
              )}

              <NeuButton
                onClick={handleBuy}
                disabled={!amount || parseFloat(amount) <= 0 || isLoading || !rounds[selectedRound].active}
                className="w-full mt-6"
                size="lg"
              >
                {isLoading ? (
                  'Processing...'
                ) : !rounds[selectedRound].active ? (
                  'Round Inactive'
                ) : (
                  <>
                    Buy Tokens
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </NeuButton>

              {!rounds[selectedRound].active && (
                <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>This round is currently inactive</span>
                </div>
              )}
            </NeuCard>
          </>
        )}

        {/* Purchase History */}
        {purchases.length > 0 && (
          <NeuCard className="p-6">
            <h2 className="text-xl font-bold text-[#5c5243] mb-4">Your Purchase History</h2>
            <div className="space-y-3">
              {purchases.map((purchase, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                >
                  <div>
                    <p className="font-medium text-[#5c5243]">
                      {parseFloat(purchase.amount).toLocaleString()} UNITY
                    </p>
                    <p className="text-sm text-[#8c7a6b] capitalize">
                      {purchase.round} Round • ${purchase.price.toFixed(3)}/token
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#8c7a6b]">
                      {new Date(purchase.purchaseTime).toLocaleDateString()}
                    </p>
                    {purchase.claimed ? (
                      <span className="text-xs text-green-600 font-medium">Claimed</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Vesting</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </NeuCard>
        )}

        {/* Vesting Info */}
        <NeuCard className="p-6 mt-8">
          <h2 className="text-xl font-bold text-[#5c5243] mb-4">Vesting Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <Clock className="w-8 h-8 mx-auto mb-3 text-[#5c5243]" />
              <h3 className="font-bold text-[#5c5243] mb-2">6 Months Cliff</h3>
              <p className="text-sm text-[#8c7a6b]">
                No tokens can be claimed for the first 6 months after purchase
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-[#5c5243]" />
              <h3 className="font-bold text-[#5c5243] mb-2">Linear Vesting</h3>
              <p className="text-sm text-[#8c7a6b]">
                After the cliff, tokens vest linearly over the next 6 months
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-[#5c5243]" />
              <h3 className="font-bold text-[#5c5243] mb-2">Full Access</h3>
              <p className="text-sm text-[#8c7a6b]">
                After 12 months, 100% of purchased tokens are fully unlocked
              </p>
            </div>
          </div>
        </NeuCard>
      </div>
    </div>
  );
};

export default TokenSalePage;
