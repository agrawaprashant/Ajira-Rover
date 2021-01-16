type Action = "move" | "collect-sample";

interface State {
  name: string;
  allowedActions: Action[];
}

export default State;
