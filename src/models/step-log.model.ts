export class EntryDate {
  rawDate: string;
  month: string;
  monthNum: number;
  day: number;
  year: number;
}

export class StepEntry {

  date: EntryDate;
  steps: number;
  note: string;
  goal: number;
}
