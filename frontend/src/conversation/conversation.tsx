import React from 'react';
import axios from 'axios';
import Result from '../models/models';
import { useParams } from 'react-router';
import { convertFormatting } from '../query/display/display';

interface ConversationState {
    conversationName: string;
    results: Result[];
}

interface ConversationProps {
    params: Params;
}

interface Params{
    conversationName: string;
}

class Conversation extends React.PureComponent<ConversationProps, ConversationState> {


    constructor(props: ConversationProps) {
        super(props)
        var conversationName = this.props.params.conversationName
        this.state = {'conversationName': conversationName,
                        'results': new Array<Result>()}
    }

    componentDidMount() {
        if (this.state.conversationName) {
            this.queryConversation(this.state.conversationName)
        }

    }

    queryConversation = (conversationName: string) => {
            axios.post('http://localhost:4000/conversation',
                { 'conversation_name': conversationName },
                { headers: { 'Content-Type': 'application/json' } })
                .then((response) => {
                    console.log(response)
                    this.setState({ 'results': response.data })
                })
    }

    notFound = () => {
        return (
            <p>Not found</p>
        )
    }

    render() {
        console.log(this.state)
        if (!this.state || this.state.conversationName === '' || this.state.results.length === 0) {
            return this.notFound()
        } else {
            return (
                <div className='conversation'>
                    {this.state.results.map((result: Result) => {
                        return (
                            <div key={result.line_name}>
                                <span className='speakerName' key={result.line_name + '-' + result.speaker}>{result.speaker}</span>
                                <span className='conversationName' key={result.line_name + '-' + result.conversation_name}>{result.conversation_name}</span>
                                <br />
                                <div className='text' key={result.line_name + '-container'}>{convertFormatting(result.text, result.line_name)}</div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }

}

const withRouter = (WrappedComponent: any) => (props: any) => {
    const params = useParams();
    // etc... other react-router-dom v6 hooks
  
    return (
      <WrappedComponent
        {...props}
        params={params}
        // etc...
      />
    );
  };

export default withRouter(Conversation);