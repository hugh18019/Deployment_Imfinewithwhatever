import { createContext, useContext, Component, Fragment } from "react";
import API from "../../API_Interface";
import { DehydrateContext } from "../../providers/DeHydrateProvider";
import contextSelector from "../../utils/ContextSelector";
import { HYDRATE } from "../../reducer/User/UserActions";
import StringToObject from "../../utils/StringToObject";

const BackgroundDispatcher = () => {
  const { hydrateState } = useContext(DehydrateContext);

  return (
    <Fragment>
      {hydrateState.shouldHydrate && (
        <BackgroundDispatcherComponent
          content={{ data: hydrateState.data, email: hydrateState.email }}
          apiInterface={hydrateState.apiInterface}
        />
      )}
    </Fragment>
  );
};

class BackgroundDispatcherComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content == null ? null : props.content,
      apiInterface: props.apiInterface,
    };
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch = async () => {
    const res = await API[this.state.apiInterface].backgroundDispatch(this.state.content);
  };

  componentDidMount() {
    var self = this;
    async function dispatch(self) {
      if (Object.keys(self.state.content.data).length > 0) {
        await self.dispatch();
      }
    }
    dispatch(self);
  }

  render() {
    return <Fragment />;
  }
}

export default BackgroundDispatcher;