import moment from 'moment';

export interface DataType {
  tag: number;
  created: Date;
  date: Date;
  dateString: string;
  hour: number;
  retweetCount: number;
  gender: number;
  tweet: string;
  hateSpeech: number;
  createdString: string;
}

export interface TweetData {
  totalTweet: number;
  totalHateTweet: number;
  maleTweet: number;
  femaleTweet: number;
  maleHateTweet: number;
  femaleHateTweet: number;
}
export interface SummaryDataType {
  total: TweetData;
  Edu: TweetData;
  Stem: TweetData;
  Violence: TweetData;
  Reproduction: TweetData;
  Work: TweetData;
  Politics: TweetData;
}

export interface HourlyTweetData extends SummaryDataType {
  hour: number;
  dateDay: Date;
  dateTime: Date;
}

export interface AggregatedDataType extends SummaryDataType {
  date: Date;
  hourlyData: HourlyTweetData[];
}

export interface DateRangeType {
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export interface TooltipDatatype {
  dateTime: Date;
  totalTweet: number;
  totalFemaleTweet: number;
  totalHateTweet: number;
  totalFemalehateTweet: number;
  xPos: number;
}

export interface UnformattedDataType {
  Hour: number;
  date: string;
  Topic: number;
  tweets: number;
  Male: number;
  Female: number;
  MaleHate: number;
  FemaleHate: number;
  MaleNoHate: number;
  FemaleNoHate: number;
}
export interface DayDataType {
  date: moment.Moment;
  topic: number;
  tweets: number;
  male: number;
  female: number;
  maleHate: number;
  femaleHate: number;
  maleNoHate: number;
  femaleNoHate: number;
}

export interface HourDataType {
  dateTime: moment.Moment;
  duration: number;
  topic: number;
  tweets: number;
  male: number;
  maleHate: number;
  femaleHate: number;
}

export interface TopicDataSummarDataType {
  dateTime: moment.Moment;
  topic: number;
  duration: number;
  tweets: number;
  male: number;
  maleHate: number;
  femaleHate: number;
}

export interface FinalHourlyDataType {
  total: TopicDataSummarDataType[];
  education: TopicDataSummarDataType[];
  violence: TopicDataSummarDataType[];
  reproduction: TopicDataSummarDataType[];
  work: TopicDataSummarDataType[];
  politics: TopicDataSummarDataType[];
}
