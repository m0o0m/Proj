export class AccountVO {
  // 上级ID
  parentId: string = '';
  // ID
  userId: string = '';
  userType: number;
  id: string = '';
  // 类型
  type: string = '';
  loginName: string = '';
  nickName: string = '';
  // 客服
  customerService: string = '';
  telNumber: string = '';
  email: string = '';
  password: string = '';
  repwd: string = '';
  balance: string = '';
  // 称号
  title: string = '';
  // 是否自动给予称号
  isAutoTitle: boolean = false;

  // 限红数据
  chips: string = '';

  // 真人洗码比
  washPercentage: string = '';
  // VIP包台
  isPackage: boolean = false;
  // 包房数量
  roomMember: number = 0;
  // 真人代理占成
  intoPercentage: string = '';
  // VIP包台占成
  coPercentage: string = '';
  // 最高赢额
  biggestWinMoney: number = 0;
  // 最高余额
  biggestBalance: number = 0;

  // 语音
  isPhone: boolean = false;
  // 语音洗码比
  sPercentage3: string = '';
  // 语言占成
  oPercentage3: string = '';

  // 老虎机
  isTiger: boolean = false;
  // 老虎机洗码比
  tigersPercentage: string = '';
  // 老虎机占成
  tigeroPercentage: string = '';
  // 充值金额
  slotDepositAmount: string = '';

  // 彩票
  isTicket: boolean = false;
  // 彩票洗码比
  ticketsPercentage: string = '';
  // 彩票占成
  ticketoPercentage: string = '';
  // 限额
  ticketLimit: string = '';

  constructor() {}

}
