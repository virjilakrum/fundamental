import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

const DEVNET_ENDPOINT = 'https://api.devnet.solana.com';
export const connection = new Connection(DEVNET_ENDPOINT);

export const requestAirdrop = async (
  publicKey: PublicKey,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  try {
    const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    onSuccess?.();
  } catch (error: any) {
    console.error('Airdrop error:', error);
    onError?.(error instanceof Error ? error : new Error(error.message));
  }
};

export const sendDonation = async (
  wallet: WalletContextState,
  amount: number,
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  try {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Get latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create transaction
    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      recentBlockhash: blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey('DfLZXdQ5bPnxgnU8EvdG5pWfuEFBUBWxV8GJqKvqPUvZ'),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Sign and send transaction
    const signedTx = await wallet.signTransaction!(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });

    if (confirmation.value.err) {
      throw new Error('Transaction failed');
    }

    onSuccess();
  } catch (error: any) {
    console.error('Transaction error:', error);
    onError(error instanceof Error ? error : new Error(error.message));
  }
};

export const getBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Failed to fetch wallet balance');
  }
};