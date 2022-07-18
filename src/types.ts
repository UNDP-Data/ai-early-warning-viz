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
