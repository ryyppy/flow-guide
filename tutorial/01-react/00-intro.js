/* @flow */

import React from 'react';
import { fetchRunSessions } from './util/fetchMocks';

/**
 * To start things off, we will start writing a React component &
 * a stateful container and see what's happening...
 *
 * Initial Note:
 * -------------------
 *
 * Flow is not a complete replacement for React.PropTypes.
 * With that in mind, flow will help you find coding errors in a
 * more proactive way, before you even run the code (e.g. 'you 
 * missed a prop in this JSX component').
 *
 * In occassions where you pass down props via generic server request
 * procedures without validation, React.PropTypes
 * will do a better job hinting a faulty response from your service
 * during runtime.
 *
 * So either you make sure your dynamically passed down props are either
 * type-safe (via validation, default-values, etc.), or think about
 * using babel-plugin for transpiling flow types to PropTypes, like this one:
 *
 * https://www.npmjs.com/package/babel-plugin-flow-react-proptypes
 *
 * Here are some hints why flow type might be better than your already maintained
 * PropTypes:
 *   - Self-documenting callback definitions
 *     - For example: (arg: number) => string
 *     - Instead of: React.PropTypes.function 
 *   - Highly reusable types, especially useful for props passing 
 *   - Flow types can also be used outside of the Component scope (controller logic etc.) 
 *   - Better readability, no implicit optional props (flow = .isRequired by default)
 *   - Because of type-checking, easier to refactor props etc. 
 */ 

/**
 * These types will be used throughout our examples,
 * sometimes they will be enhanced if the tutorial requires
 * more complex structures
 */

export type User = {
  id: string,
  firstname: string,
  lastname: string,
  username: string,
};

export type RunSession = {
  duration: number,
  distance: number,

  // Here you can already see the reusage of complex objects
  user: User, 
};

type ActivityBoxStyle = 'list' | 'grid'; 

export class ActivityBox extends React.Component {
  /**
   * We define the structure of our props,
   * which will usually be done during runtime
   * via React.PropTypes
   */
  props: {
    // This would be equal to `React.PropTypes.boolean.isRequired`
    isLoading: boolean,

    // This would equal to `React.PropTypes.oneOf(['grid', 'list']).isRequired`
    showAs: ActivityBoxStyle,

    // Optional callback interface for clicking listed RunSessions
    // This would equal to the less detailed `React.PropType.function`
    onProfileClick?: (user: User) => void,

    data: Array<RunSession>,
  };

  render() {
    const {
      isLoading,
      showAs,
      data = [],
    } = this.props;

    const renderData = () => {
      switch (showAs) {
        case 'list': return this._renderList(data);
        case 'grid': return this._renderGrid(data);
        default: return null;
      }
    };

    return (
      <div>
        {this._renderLoading(isLoading)}
        {renderData()}
      </div>
    );
  }

  _renderLoading(isLoading: boolean): ?React$Element<*> {
    if (!isLoading) {
      return null;
    }

    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  _renderList(data: Array<RunSession>): ?React$Element<*> {
    return (<div>[Some list structure]</div>);
  }

  _renderGrid(data: Array<RunSession>): ?React$Element<*> {
    return (<div>[Some grid structure]</div>);
  }
}

/**
 * Since we need a constructor for App,
 * we need to put these Props in it's own
 * type definition
 */
type AppProps = {
  showAs: ActivityBoxStyle,
};

export class App extends React.Component {
  props: AppProps;

  /**
   * Here we are trying to define the local state
   * this container will manage our dumb component(s)
   */
  state: {
    isLoading?: boolean,
    data: Array<RunSession>, 
  };

  /**
   * Sadly we have to annotate the constructor
   * here, since flow does not interpret the
   * input parameter properly otherwise 
   */
  constructor(props: AppProps) {
    // Don't forget the super call, otherwise
    // you don't have any `this` context
    super(props);

    this.state = {
      // The state has to reflect the types
      // of defined attributes... try to change
      // it to 'string' and you will see an error
      isLoading: true,
      data: [],
    };
  }

  // Loads our mock-data in our state 
  _loadRunSessions() {
    return fetchRunSessions()
      .then((runSessions) => {
        // We are naive and don't validate that stuff
        this.setState({
          isLoading: false,
          data: runSessions,
        });
      });
  }

  render() {
    const { showAs } = this.props;
    const { isLoading, data } = this.state;

    return (
      <div>
        // Now if you try to remove any of these props, a flow error will be shown
        <ActivityBox isLoading={isLoading} showAs={showAs} data={data} />
      </div>
    );
  }
}
