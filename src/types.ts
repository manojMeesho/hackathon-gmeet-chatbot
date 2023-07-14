export interface FileDetails {
  resourceUrl: string;
  _id: string;
  status: string;
  url: string;
  language_model: string;
  acoustic_model: string;
  language_code: string;
  audio_url: string;
  text: string;
  words?: WordsEntity[] | null;
  utterances?: UtterancesEntity[] | null;
  confidence: number;
  audio_duration: number;
  punctuate: boolean;
  format_text: boolean;
  dual_channel: boolean;
  webhook_url?: null;
  webhook_status_code?: null;
  webhook_auth: boolean;
  webhook_auth_header_name?: null;
  speed_boost: boolean;
  auto_highlights_result: AutoHighlightsResult;
  auto_highlights: boolean;
  audio_start_from?: null;
  audio_end_at?: null;
  word_boost?: null[] | null;
  boost_param?: null;
  filter_profanity: boolean;
  redact_pii: boolean;
  redact_pii_audio: boolean;
  redact_pii_audio_quality?: null;
  redact_pii_policies?: null;
  redact_pii_sub?: null;
  speaker_labels: boolean;
  content_safety: boolean;
  iab_categories: boolean;
  language_detection: boolean;
  custom_spelling?: null;
  throttled?: null;
  auto_chapters: boolean;
  summarization: boolean;
  summary_type: string;
  summary_model: string;
  custom_topics: boolean;
  topics?: null[] | null;
  speech_threshold?: null;
  disfluencies: boolean;
  sentiment_analysis: boolean;
  sentiment_analysis_results?: SentimentAnalysisResultsEntity[] | null;
  chapters?: null;
  entity_detection: boolean;
  entities?: EntitiesEntity[] | null;
  speakers_expected?: null;
  pollingEndpoint: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  content_safety_labels: ContentSafetyLabels;
  iab_categories_result: IabCategoriesResult;
  id: string;
  summary: string;
  gptSummary?: string;
  speakerMeta: { [code: string]: string };
  qna?: string;
  actionItem?: string;
}
export interface WordsEntity {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker: string;
}
export interface UtterancesEntity {
  confidence: number;
  end: number;
  speaker: string;
  start: number;
  text: string;
  words?: WordsEntity[] | null;
}
export interface AutoHighlightsResult {
  status: string;
  results?: ResultsEntity[] | null;
}
export interface ResultsEntity {
  count: number;
  rank: number;
  text: string;
  timestamps?: TimestampsEntityOrTimestamp[] | null;
}
export interface TimestampsEntityOrTimestamp {
  start: number;
  end: number;
}
export interface SentimentAnalysisResultsEntity {
  text: string;
  start: number;
  end: number;
  sentiment: string;
  confidence: number;
  speaker: string;
}
export interface EntitiesEntity {
  entity_type: string;
  text: string;
  start: number;
  end: number;
}
export interface ContentSafetyLabels {
  status: string;
  results?: null[] | null;
  summary: Summary;
}
export interface Summary {}
export interface IabCategoriesResult {
  status: string;
  results?: ResultsEntity1[] | null;
}
export interface ResultsEntity1 {
  text: string;
  labels?: LabelsEntity[] | null;
  timestamp: TimestampsEntityOrTimestamp;
  sentences_idx_start: number;
  sentences_idx_end: number;
}
export interface LabelsEntity {
  relevance: number;
  label: string;
}
