"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import FilterDropdown from '../components/filters/FilterDropdown';
import { NetworkIcon, TokenIcon, VaultIcon, GnosisSafeIcon, TrackedWalletIcon, WalletIcon, BSCIcon, EthereumIcon, GnosisIcon, OPTIMISMIcon, PolygonIcon, SOLIcon } from './../components/icons';
import { Asset } from './types';
import AssetList from './AssetList';

interface AssetListClientProps {
  assets: Asset[];
  initialWalletFilter?: string;
}

export default function AssetListClient({ assets, initialWalletFilter }: AssetListClientProps) {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [selectedBlockchains, setSelectedBlockchains] = useState<string[]>([]);
  const hasAppliedInitialFilter = useRef(false);

  const renderWalletIcon = (walletType: number) => {
    switch (walletType) {
      case 1:
        return <VaultIcon className="w-4 h-4 shrink-0 aspect-square" />;
      case 2:
        return <GnosisSafeIcon className="w-4 h-4 shrink-0 aspect-square" />;
      case 3:
        return <TrackedWalletIcon className="w-4 h-4 shrink-0 aspect-square" />;
      default:
        return null;
    }
  };

  const getBlockchainIcon = (blockchainName: string) => {
    switch (blockchainName) {
      case "BSC":
        return <BSCIcon className="w-4 h-4 shrink-0" />;
      case "Ethereum":
        return <EthereumIcon className="w-4 h-4 shrink-0" />;
      case "Gnosis chain":
        return <GnosisIcon className="w-4 h-4 shrink-0" />;
      case "Optimism":
        return <OPTIMISMIcon className="w-4 h-4 shrink-0" />;
      case "Polygon":
        return <PolygonIcon className="w-4 h-4 shrink-0" />;
      case "Solana":
        return <SOLIcon className="w-4 h-4 shrink-0" />;
      default:
        return null;
    }
  };

  // First, get assets filtered by other filters (excluding the current filter dimension)
  const assetsForTokenOptions = useMemo(() => {
    return assets.filter(asset => {
      const walletMatch = selectedWallets.length === 0 ||
        asset.wallets.some(wallet => selectedWallets.includes(wallet.walletId.toString()));

      const blockchainMatch = selectedBlockchains.length === 0 ||
        (typeof asset.blockchain === 'string'
          ? selectedBlockchains.includes(asset.blockchain)
          : asset.blockchain.some(bc => selectedBlockchains.includes(bc.blockchain))
        );

      return walletMatch && blockchainMatch;
    });
  }, [assets, selectedWallets, selectedBlockchains]);

  const assetsForWalletOptions = useMemo(() => {
    return assets.filter(asset => {
      const tokenMatch = selectedTokens.length === 0 || selectedTokens.includes(asset.symbol);

      const blockchainMatch = selectedBlockchains.length === 0 ||
        (typeof asset.blockchain === 'string'
          ? selectedBlockchains.includes(asset.blockchain)
          : asset.blockchain.some(bc => selectedBlockchains.includes(bc.blockchain))
        );

      return tokenMatch && blockchainMatch;
    });
  }, [assets, selectedTokens, selectedBlockchains]);



  const assetsForBlockchainOptions = useMemo(() => {
    return assets.filter(asset => {
      const tokenMatch = selectedTokens.length === 0 || selectedTokens.includes(asset.symbol);

      const walletMatch = selectedWallets.length === 0 ||
        asset.wallets.some(wallet => selectedWallets.includes(wallet.walletId.toString()));

      return tokenMatch && walletMatch;
    });
  }, [assets, selectedTokens, selectedWallets]);

  // Now compute options from the pre-filtered assets
  // Token options with search text
  // Updated tokenOptions with unique tokens
  const tokenOptions = useMemo(() => {
    // Get unique tokens by assetId (or symbol if assetId is not available)
    let uniqueAssets = Array.from(
      new Map(assetsForTokenOptions.map(asset => [asset.assetId || asset.symbol, asset])).values()
    );

    uniqueAssets = uniqueAssets.sort((a, b) => a.name.localeCompare(b.name));

    return uniqueAssets.map(asset => ({
      value: asset.symbol,
      id: asset.assetId || asset.symbol, // Use assetId as unique identifier
      searchText: `${asset.fullName} ${asset.symbol}`.toLowerCase(),
      display: (
        <div className="flex pt-[8px] pr-[4px] pb-[0] pl-[12px] flex-col items-start gap-2.5">
          <div className="flex w-full h-[22px] py-[2px] px-[4px] items-center gap-2">
            <div className="w-4 h-4 shrink-0"><i className={`cf cf-${asset.symbol}`}></i></div>
            <div className="flex items-baseline gap-1.5 flex-[1_0_0]">
              <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{asset.fullName}</span>
              <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-thin leading-[normal] uppercase">{asset.symbol}</span>
            </div>
            {/* <div >Checkbox container</div>
            <IconButton
                      icon={isOptionSelected(option.value) ? <CheckBoxFilledIcon /> : <CheckBoxOutlineIcon />}
                      size="md"
                      onClick={() => toggleFilter(option.value)}
                      aria-hidden="true"
                      className="w-4 h-4 shrink-0"
                    /> */}
          </div>
        </div>
      ),
      displayProps: {
        fullName: asset.fullName,
        metaData: asset.symbol,
        icon: <i className={`cf cf-${asset.symbol}`}></i>
      }
    }));
  }, [assetsForTokenOptions]);


  // In your AssetListClient component, update the walletOptions to include groupKey:
  const walletOptions = useMemo(() => {
    const allWallets = assetsForWalletOptions.flatMap(asset => asset.wallets);
    let uniqueWallets = Array.from(
      new Map(allWallets.map(wallet => [wallet.walletId, wallet])).values()
    );

    uniqueWallets = uniqueWallets.sort((a, b) => a.name.localeCompare(b.name));

    return uniqueWallets.map(wallet => ({
      value: wallet.walletId.toString(),
      id: wallet.walletId,
      searchText: (wallet.name || `Wallet ${wallet.walletId}`).toLowerCase(),
      groupKey: `${wallet.walletType}`, // Add group key based on wallet type
      display: (
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-[#26C9C9] rounded-full">
            {/* <WalletIcon className="w-3 h-3 text-[#0E1011]" /> */}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
              {wallet.name || `Wallet ${wallet.walletId}`}
            </span>
          </div>
        </div>
      ),
      displayProps: {
        fullName: wallet.name || `Wallet ${wallet.walletId}`,
        icon: renderWalletIcon(wallet.walletType)
      }
    }));
  }, [assetsForWalletOptions]);

  // useEffect(() => {
  //   if (initialWalletFilter && walletOptions.length > 0) {
  //     // Find the wallet ID that matches the wallet name
  //     const matchingWallet = walletOptions.find(
  //       option => option.displayProps.fullName.toLowerCase() === initialWalletFilter.toLowerCase()
  //     );

  //     if (matchingWallet && !selectedWallets.includes(matchingWallet.value)) {
  //       setSelectedWallets([matchingWallet.value]);
  //     }
  //   }
  // }, [initialWalletFilter, walletOptions]);


  useEffect(() => {
    if (initialWalletFilter && walletOptions.length > 0 && !hasAppliedInitialFilter.current) {
      // Find the wallet ID that matches the wallet name
      const matchingWallet = walletOptions.find(
        option => option.displayProps.fullName.toLowerCase() === initialWalletFilter.toLowerCase()
      );

      if (matchingWallet) {
        setSelectedWallets(prev => {
          // Only update if not already included
          if (!prev.includes(matchingWallet.value)) {
            hasAppliedInitialFilter.current = true;
            return [matchingWallet.value];
          }
          return prev;
        });
      }
    }
  }, [initialWalletFilter, walletOptions]);

  // Define wallet groups
  const walletGroups = [
    { key: '1', label: 'Vaults' },
    { key: '2', label: 'Gnosis Safes' },
    { key: '3', label: 'Tracked Wallets' },
  ];

  // Blockchain options with search text
  const blockchainOptions = useMemo(() => {
    const allBlockchains = assetsForBlockchainOptions.flatMap(asset => {
      if (typeof asset.blockchain === 'string') {
        return [asset.blockchain];
      } else if (Array.isArray(asset.blockchain)) {
        return asset.blockchain.map(bc => bc.blockchain);
      }
      return [];
    });

    let uniqueBlockchains = Array.from(new Set(allBlockchains.filter(bc => bc)));

    uniqueBlockchains = uniqueBlockchains.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return uniqueBlockchains.map(blockchain => ({
      value: blockchain,
      id: blockchain,
      searchText: blockchain.toLowerCase(),
      display: (
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            {/* Add blockchain icon if available */}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
              {blockchain}
            </span>
          </div>
        </div>
      ),
      displayProps: {
        fullName: blockchain,
        icon: getBlockchainIcon(blockchain)
      }
    }));
  }, [assetsForBlockchainOptions]);

  // Final filtered assets (all filters applied)
  const filteredAssets = useMemo(() => {
    if (selectedTokens.length === 0 && selectedWallets.length === 0 && selectedBlockchains.length === 0) {
      return assets;
    }

    return assets.filter(asset => {
      const tokenMatch = selectedTokens.length === 0 || selectedTokens.includes(asset.symbol);

      const walletMatch = selectedWallets.length === 0 ||
        asset.wallets.some(wallet => selectedWallets.includes(wallet.walletId.toString()));

      const blockchainMatch = selectedBlockchains.length === 0 ||
        (typeof asset.blockchain === 'string'
          ? selectedBlockchains.includes(asset.blockchain)
          : asset.blockchain.some(bc => selectedBlockchains.includes(bc.blockchain))
        );

      return tokenMatch && walletMatch && blockchainMatch;
    });
  }, [assets, selectedTokens, selectedWallets, selectedBlockchains]);

  // Clean up selected values when options change, but only if needed
  useEffect(() => {
    if (selectedTokens.length > 0) {
      const validTokens = new Set(tokenOptions.map(opt => opt.value));
      const hasInvalidTokens = selectedTokens.some(token => !validTokens.has(token));

      if (hasInvalidTokens) {
        setSelectedTokens(prev => prev.filter(token => validTokens.has(token)));
      }
    }
  }, [tokenOptions, selectedTokens]); // Added selectedTokens to dependencies

  useEffect(() => {
    if (selectedWallets.length > 0) {
      const validWallets = new Set(walletOptions.map(opt => opt.value));
      const hasInvalidWallets = selectedWallets.some(wallet => !validWallets.has(wallet));

      if (hasInvalidWallets) {
        setSelectedWallets(prev => prev.filter(wallet => validWallets.has(wallet)));
      }
    }
  }, [walletOptions, selectedWallets]);

  useEffect(() => {
    if (selectedBlockchains.length > 0) {
      const validBlockchains = new Set(blockchainOptions.map(opt => opt.value));
      const hasInvalidBlockchains = selectedBlockchains.some(blockchain => !validBlockchains.has(blockchain));

      if (hasInvalidBlockchains) {
        setSelectedBlockchains(prev => prev.filter(blockchain => validBlockchains.has(blockchain)));
      }
    }
  }, [blockchainOptions, selectedBlockchains]);

  const totalCount = assets.length;
  const showingCount = filteredAssets.length;
  const hasActiveFilters = selectedTokens.length > 0 || selectedWallets.length > 0 || selectedBlockchains.length > 0;

  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      {/* Filter Section */}
      <div className="flex items-start gap-8 self-stretch">
        <div className="flex items-start gap-5 self-stretch">
          <FilterDropdown
            options={tokenOptions}
            selectedValues={selectedTokens}
            onSelectionChange={setSelectedTokens}
            label="Token"
            buttonIcon={<TokenIcon />}
          />

          <FilterDropdown
            options={walletOptions}
            selectedValues={selectedWallets}
            onSelectionChange={setSelectedWallets}
            label="Wallet"
            buttonIcon={<WalletIcon />}
            groups={walletGroups} // Pass the groups configuration
          />

          <FilterDropdown
            options={blockchainOptions}
            selectedValues={selectedBlockchains}
            onSelectionChange={setSelectedBlockchains}
            label="Blockchain"
            buttonIcon={<NetworkIcon />}
          />
        </div>
        <div className={`flex item ${hasActiveFilters ? "justify-between" : "justify-end"} items-center flex-[1_0_0] h-7`}>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSelectedTokens([]);
                setSelectedWallets([]);
                setSelectedBlockchains([]);
              }}
              className="flex items-center flex-shrink-0 gap-1 pt-[3px] pr-[8px] pb-[3px] pl-[8px] rounded-full bg-[#F8FCFF]/16 hover:bg-[#F8FCFF]/16 border-solid border-[1px] border-[#F8FCFF]/32 hover:border-[#F8FCFF]/64 cursor-pointer transition-all duration-150 ease-in-out"
            // className="group/dropdown flex py-[2px] px-[8px] items-center rounded-md border-[0.5px] gap-[4px] border-dashed hover:border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 group-hover:border-[#F8FCFF] group-hover:bg-[#F8FCFF]/16 hover:cursor-pointer transition-all duration-150 ease-in-out hover:border-[#26C9C9]/64 hover:bg-[#26C9C9]/12"
            >
              <span className="font-[Geist] text-sm">
                Clear all
              </span>
            </button>
          )}
          <div className="flex text-[#E7E8E9] text-sm items-center opacity-80">
            {hasActiveFilters ? (
              <span className='font-medium'>
                Showing <span className="font-bold">{showingCount}</span> of{' '}
                <span className="font-medium">{totalCount}</span> assets
              </span>
            ) : (
              <span>
                Showing all <span className="font-medium">{totalCount}</span> assets
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[11.5px] items-center gap-4 self-stretch bg-[#18191B]">
          <span className="w-[262px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Token & Network</span>
          <div className="w-[248px] flex items-center justify-between gap-4">
            <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] text-right w-[116px]">Price</span>
            <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] w-[116px]">Last 24 Hrs</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] text-right ">Token value</span>
            <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">USD</span>
          </div>
          <span className="w-[150px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Wallets</span>
        </div>
        <AssetList assets={filteredAssets} />
      </div>
      <div className="flex items-start justify-end text-[#E7E8E9] text-sm items-center opacity-80 self-stretch">
        {hasActiveFilters ? (
          <span className='font-medium'>
            Showing <span className="font-bold">{showingCount}</span> of{' '}
            <span className="font-medium">{totalCount}</span> assets
          </span>
        ) : (
          <span>
            Showing all <span className="font-medium">{totalCount}</span> assets
          </span>
        )}
      </div>
    </div>
  );
}