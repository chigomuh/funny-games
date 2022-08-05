export interface Word {
  pos: string;
  sense: {
    definition: string;
    link: string;
    type: string;
  };
  sup_no: string;
  target_code: string;
  word: string;
  entered: "user" | "bot";
}
