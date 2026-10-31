
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  IndianRupee,
  TrendingUp,
  PackageCheck,
  Wallet,
  ArrowDownToLine,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  CreditCard,
  Info,
} from 'lucide-react';

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending';
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-1001',
    title: 'Delivery payout · SUB-1044',
    date: 'Today, 11:30 AM',
    amount: 70,
    status: 'Completed',
  },
  {
    id: 'TXN-1002',
    title: 'Delivery payout · SUB-1042',
    date: 'Today, 10:15 AM',
    amount: 85,
    status: 'Completed',
  },
  {
    id: 'TXN-1003',
    title: 'Weekly settlement',
    date: 'Yesterday',
    amount: 450,
    status: 'Pending',
  },
];

export default function RiderEarningsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  const [availableBalance, setAvailableBalance] = useState(2450);
  const [pendingBalance] = useState(450);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(
    INITIAL_TRANSACTIONS,
  );
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);

  const completedTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => transaction.status === 'Completed',
      ),
    [transactions],
  );

  const completedTotal = completedTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  function requestWithdrawal() {
    const amount = Number(withdrawAmount);

    if (!withdrawAmount.trim() || !Number.isFinite(amount)) {
      showMessage('Enter a valid withdrawal amount.', true);
      return;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      showMessage('Enter a positive whole amount in rupees.', true);
      return;
    }

    if (amount < 100) {
      showMessage('The minimum demo withdrawal is ₹100.', true);
      return;
    }

    if (amount > availableBalance) {
      showMessage('Your amount exceeds the available balance.', true);
      return;
    }

    const newTransaction: Transaction = {
      id: `WD-${Date.now()}`,
      title: 'Demo withdrawal request',
      date: 'Just now',
      amount: -amount,
      status: 'Pending',
    };

    setAvailableBalance((balance) => balance - amount);
    setTransactions((current) => [newTransaction, ...current]);
    setWithdrawAmount('');
    showMessage(
      `Demo withdrawal request for ₹${amount.toLocaleString('en-IN')} created. No money was transferred.`,
      false,
    );
  }

  function showMessage(message: string, isError: boolean) {
    setNotice(message);
    setNoticeIsError(isError);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        isMobile && styles.mobileContent,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Page heading */}
      <View style={styles.pageHeader}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>RIDER PARTNER</Text>
          <Text style={styles.pageTitle}>Earnings & Wallet</Text>
          <Text style={styles.pageDescription}>
            Track your income, manage your balance and review payouts.
          </Text>
        </View>

        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>DEMO DATA</Text>
        </View>
      </View>

      {/* Earnings summary */}
      <View
        style={[
          styles.earningsHero,
          isMobile && styles.mobileEarningsHero,
        ]}
      >
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <IndianRupee size={23} color="#246B50" />
          </View>
          <View style={styles.heroPeriod}>
            <Text style={styles.heroPeriodLabel}>TODAY'S EARNINGS</Text>
            <Text style={styles.heroPeriodValue}>₹850</Text>
          </View>
        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroBottom}>
          <View style={styles.heroMetric}>
            <TrendingUp size={17} color="#23784F" />
            <Text style={styles.heroMetricText}>
              +12% from yesterday
            </Text>
          </View>
          <Text style={styles.heroCaption}>
            Sample figures for demonstration
          </Text>
        </View>
      </View>

      {/* Summary cards */}
      <View
        style={[
          styles.summaryGrid,
          isMobile && styles.mobileSummaryGrid,
        ]}
      >
        <SummaryCard
          icon={<TrendingUp size={20} color="#246B50" />}
          label="This week"
          value="₹4,250"
          caption="Demo total"
        />
        <SummaryCard
          icon={<PackageCheck size={20} color="#4774B8" />}
          label="Completed"
          value="12"
          caption="Deliveries today"
        />
      </View>

      {/* Wallet section */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>My Wallet</Text>
          <Text style={styles.sectionSubtitle}>
            Balance and withdrawal requests
          </Text>
        </View>

        <View style={styles.walletIcon}>
          <Wallet size={21} color="#246B50" />
        </View>
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Available balance</Text>
        <Text style={styles.walletBalance}>
          ₹{availableBalance.toLocaleString('en-IN')}
        </Text>

        <View style={styles.balanceDivider} />

        <View style={styles.balanceRow}>
          <View style={styles.balanceRowLabel}>
            <Clock3 size={16} color="#819087" />
            <Text style={styles.balanceLabel}>Pending payouts</Text>
          </View>
          <Text style={styles.pendingValue}>
            ₹{pendingBalance.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={[styles.balanceRow, styles.lastBalanceRow]}>
          <View style={styles.balanceRowLabel}>
            <CheckCircle2 size={16} color="#23784F" />
            <Text style={styles.balanceLabel}>Completed transactions</Text>
          </View>
          <Text style={styles.completedValue}>
            ₹{completedTotal.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Withdrawal form */}
      <View style={styles.withdrawCard}>
        <View style={styles.withdrawHeading}>
          <View style={styles.withdrawIcon}>
            <ArrowDownToLine size={21} color="#246B50" />
          </View>
          <View style={styles.withdrawHeadingCopy}>
            <Text style={styles.withdrawTitle}>Withdraw money</Text>
            <Text style={styles.withdrawSubtitle}>
              Minimum withdrawal: ₹100
            </Text>
          </View>
        </View>

        <Text style={styles.inputLabel}>Withdrawal amount (₹)</Text>

        <View style={styles.amountInputWrapper}>
          <Text style={styles.rupeePrefix}>₹</Text>
          <TextInput
            value={withdrawAmount}
            onChangeText={(value) => {
              setWithdrawAmount(value.replace(/[^0-9]/g, ''));
              setNotice('');
            }}
            placeholder="Enter amount"
            placeholderTextColor="#98A39B"
            keyboardType="number-pad"
            style={styles.amountInput}
            accessibilityLabel="Withdrawal amount in rupees"
          />
        </View>

        <View style={styles.quickAmounts}>
          {[500, 1000, 2000].map((amount) => (
            <Pressable
              key={amount}
              onPress={() => {
                setWithdrawAmount(String(amount));
                setNotice('');
              }}
              style={styles.quickAmountButton}
              accessibilityRole="button"
            >
              <Text style={styles.quickAmountText}>
                ₹{amount.toLocaleString('en-IN')}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={requestWithdrawal}
          style={styles.withdrawButton}
          accessibilityRole="button"
        >
          <ArrowDownToLine size={18} color="#FFFFFF" />
          <Text style={styles.withdrawButtonText}>
            Request withdrawal
          </Text>
        </Pressable>

        {notice ? (
          <View
            style={[
              styles.notice,
              noticeIsError && styles.errorNotice,
            ]}
          >
            {noticeIsError ? (
              <Info size={17} color="#A34C36" />
            ) : (
              <CheckCircle2 size={17} color="#23784F" />
            )}
            <Text
              style={[
                styles.noticeText,
                noticeIsError && styles.errorNoticeText,
              ]}
            >
              {notice}
            </Text>
          </View>
        ) : null}

        <Text style={styles.demoDisclaimer}>
          Demo only. This form does not send money or contact a bank.
          Withdrawal requests are kept in temporary page state.
        </Text>
      </View>

      {/* Transactions */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>Recent transactions</Text>
          <Text style={styles.sectionSubtitle}>
            Your latest demo wallet activity
          </Text>
        </View>
      </View>

      <View style={styles.transactionsCard}>
        {transactions.map((transaction, index) => {
          const isWithdrawal = transaction.amount < 0;

          return (
            <View
              key={transaction.id}
              style={[
                styles.transactionRow,
                index === transactions.length - 1 &&
                  styles.lastTransactionRow,
              ]}
            >
              <View
                style={[
                  styles.transactionIcon,
                  isWithdrawal && styles.withdrawalTransactionIcon,
                ]}
              >
                {isWithdrawal ? (
                  <ArrowUpRight size={20} color="#B7791F" />
                ) : (
                  <CreditCard size={20} color="#246B50" />
                )}
              </View>

              <View style={styles.transactionCopy}>
                <Text style={styles.transactionTitle}>
                  {transaction.title}
                </Text>
                <Text style={styles.transactionDate}>
                  {transaction.date}
                </Text>
                <View
                  style={[
                    styles.transactionStatus,
                    transaction.status === 'Pending' &&
                      styles.pendingStatus,
                  ]}
                >
                  <Text
                    style={[
                      styles.transactionStatusText,
                      transaction.status === 'Pending' &&
                        styles.pendingStatusText,
                    ]}
                  >
                    {transaction.status}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.transactionAmount,
                  isWithdrawal && styles.withdrawalAmount,
                ]}
              >
                {isWithdrawal ? '−' : '+'}₹
                {Math.abs(transaction.amount).toLocaleString('en-IN')}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footerNote}>
        <Info size={17} color="#819087" />
        <Text style={styles.footerNoteText}>
          All earnings, balances and transactions on this screen are
          sample data. They are not connected to live deliveries,
          payroll, a bank account or a payout provider.
        </Text>
      </View>
    </ScrollView>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>{icon}</View>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryCaption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    backgroundColor: '#F6F8F6',
  },
  content: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 26,
    paddingBottom: 40,
  },
  mobileContent: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 100,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 22,
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: '#438363',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  pageTitle: {
    color: '#20382B',
    fontSize: 27,
    lineHeight: 35,
    fontWeight: '800',
  },
  pageDescription: {
    color: '#718076',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  demoBadge: {
    backgroundColor: '#FBF0D9',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  demoBadgeText: {
    color: '#8A682A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  earningsHero: {
    backgroundColor: '#EAF4ED',
    borderWidth: 1,
    borderColor: '#D8E9DD',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
  },
  mobileEarningsHero: {
    padding: 17,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPeriod: {
    flex: 1,
    minWidth: 0,
  },
  heroPeriodLabel: {
    color: '#63796B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroPeriodValue: {
    color: '#20382B',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  heroDivider: {
    height: 1,
    backgroundColor: '#D5E6D9',
    marginVertical: 18,
  },
  heroBottom: {
    gap: 7,
  },
  heroMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  heroMetricText: {
    color: '#23784F',
    fontSize: 12,
    fontWeight: '700',
  },
  heroCaption: {
    color: '#819087',
    fontSize: 11,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 13,
    marginBottom: 28,
  },
  mobileSummaryGrid: {
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    padding: 16,
  },
  summaryIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#F0F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  summaryLabel: {
    color: '#748178',
    fontSize: 12,
  },
  summaryValue: {
    color: '#20382B',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 6,
  },
  summaryCaption: {
    color: '#819087',
    fontSize: 11,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    marginTop: 2,
  },
  sectionHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    color: '#20382B',
    fontSize: 19,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#819087',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  walletIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EAF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 18,
    padding: 19,
    marginBottom: 20,
  },
  walletLabel: {
    color: '#748178',
    fontSize: 12,
  },
  walletBalance: {
    color: '#20382B',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 7,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: '#EDF0ED',
    marginVertical: 18,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  lastBalanceRow: {
    marginBottom: 0,
  },
  balanceRowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  balanceLabel: {
    color: '#64756A',
    fontSize: 12,
    flexShrink: 1,
  },
  pendingValue: {
    color: '#8A682A',
    fontSize: 13,
    fontWeight: '800',
  },
  completedValue: {
    color: '#23784F',
    fontSize: 13,
    fontWeight: '800',
  },
  withdrawCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
  },
  withdrawHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 20,
  },
  withdrawIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#EAF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  withdrawTitle: {
    color: '#20382B',
    fontSize: 15,
    fontWeight: '800',
  },
  withdrawSubtitle: {
    color: '#819087',
    fontSize: 11,
    marginTop: 4,
  },
  inputLabel: {
    color: '#526157',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 48,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#DDE6DE',
    backgroundColor: '#FAFCFA',
  },
  rupeePrefix: {
    color: '#246B50',
    fontSize: 17,
    fontWeight: '800',
  },
  amountInput: {
    flex: 1,
    minWidth: 0,
    color: '#20382B',
    fontSize: 14,
    outlineStyle: 'none',
  } as any,
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 11,
    marginBottom: 17,
  },
  quickAmountButton: {
    borderWidth: 1,
    borderColor: '#DDE6DE',
    backgroundColor: '#F8FAF8',
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  quickAmountText: {
    color: '#246B50',
    fontSize: 12,
    fontWeight: '700',
  },
  withdrawButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    backgroundColor: '#246B50',
    borderRadius: 11,
    paddingVertical: 14,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EAF4ED',
    borderRadius: 10,
    padding: 11,
    marginTop: 13,
  },
  errorNotice: {
    backgroundColor: '#FCEDE8',
  },
  noticeText: {
    flex: 1,
    minWidth: 0,
    color: '#246B50',
    fontSize: 12,
    lineHeight: 18,
  },
  errorNoticeText: {
    color: '#A34C36',
  },
  demoDisclaimer: {
    color: '#819087',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 13,
  },
  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    paddingHorizontal: 15,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0ED',
  },
  lastTransactionRow: {
    borderBottomWidth: 0,
  },
  transactionIcon: {
    width: 41,
    height: 41,
    flexShrink: 0,
    borderRadius: 12,
    backgroundColor: '#EAF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawalTransactionIcon: {
    backgroundColor: '#FBF0D9',
  },
  transactionCopy: {
    flex: 1,
    minWidth: 0,
  },
  transactionTitle: {
    color: '#263C2E',
    fontSize: 12,
    fontWeight: '700',
  },
  transactionDate: {
    color: '#819087',
    fontSize: 10,
    marginTop: 4,
  },
  transactionStatus: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F4EA',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginTop: 6,
  },
  pendingStatus: {
    backgroundColor: '#FBF0D9',
  },
  transactionStatusText: {
    color: '#23784F',
    fontSize: 9,
    fontWeight: '800',
  },
  pendingStatusText: {
    color: '#8A682A',
  },
  transactionAmount: {
    color: '#23784F',
    fontSize: 13,
    fontWeight: '800',
  },
  withdrawalAmount: {
    color: '#8A682A',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 17,
    paddingHorizontal: 3,
  },
  footerNoteText: {
    flex: 1,
    minWidth: 0,
    color: '#819087',
    fontSize: 11,
    lineHeight: 17,
  },
});
