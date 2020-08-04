import React, { Component } from 'react'
import { API } from 'aws-amplify';
import './Home.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import 'date-fns';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
          error: null,
          isLoading: true,
          items: [],
          LastEvaluatedKey: null,
          previousPage: [null,],
          item_count: 0,
          page:0,
          selectedDate: '2020-07-30',
          eventCategory: '',
          eventType: '',
          eventAction: '',
          eventAge: '',
          isSearchEvent: false,
          endPoint: '/events',
        };             
    }
  async componentDidMount() {
    let params = {
            body: this.state.nextPage
          }      
    this.getData(params) 
  }
  useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

  switchSearchEvent(){
    this.setState({
      previousPage: [null,],
      LastEvaluatedKey: null,
      isSearchEvent: !this.state.isSearchEvent,
    });
  }
  
  getData(params){
    console.log(this.state.endPoint)
    API.post('eventapi', this.state.endPoint , params).then(res => res)
      .then((result) => {
        if(result.code !== '10100'){
            this.setState({
              LastEvaluatedKey: result.LastEvaluatedKey,
            });
            this.setState({
            isLoaded: true,
            items: result.data,
            item_count: result.count,
          });
          console.log(result.data)
        }
        else{
          this.state.previousPage.pop()
        }
      },
      (error) => {
          this.setState({
            isLoaded: true,
            error
          });
      }    
    ) 
  }
   onChangePage= (event, newPage) => {
    let params= {} 
    if(this.state.page < newPage) {
      params = {
              body: {LastEvaluatedKey : this.state.LastEvaluatedKey}
            }
      this.state.previousPage.push(this.state.LastEvaluatedKey)
      this.setState({
        previousPage: this.state.previousPage,
        page: newPage
      });  
    }
    else{
      params = {
        body: {
          LastEvaluatedKey : this.state.previousPage[this.state.page-2],
          }
        } 
        this.setState({
          page: newPage
        });
        this.state.previousPage.pop()  
    }
    this.getData(params)
  };
  handleDateChange =  event => {
    this.setState({
      selectedDate: event.target.value
    });
  };
  handleEventCatChange =  event => {
    this.setState({
      eventCategory: event.target.value
    });
  };
  handleEventTypeChange =  event => {
    this.setState({
      eventType: event.target.value
    });
  };
  handleEventActionChange =  event => {
    this.setState({
      eventAction: event.target.value
    });
  };
  handleEventAgeChange =  event => {
    this.setState({
      eventAge: event.target.value
    });
  };
  handleClick = (event, name) => {
    console.log("ABC")
  };
  searchEvents = () => {
    let params = {
      body: {
        payload: `"Age":{"S":"${this.state.eventAge}"}`,
      }
    } 
    console.log(params)
    this.setState({
      previousPage: [null,],
      LastEvaluatedKey: null,
      endPoint: '/events/search'
    });
    this.getData(params)
  }
  onCancel = () => {
    this.setState({
      previousPage: [null,],
      LastEvaluatedKey: null,
      endPoint: '/events'
    });
    let params = {
      body: null
    }      
    this.getData(params) 
  }
  onPreviousPage= () => {
    console.log(this.state.previousPage)
    let params = {
      body: {LastEvaluatedKey : this.state.previousPage[this.state.page - 2]}
    } 
    this.state.previousPage.pop()   
    this.getData(params)
  }
  render(){
    const { error, isLoaded, items, page, item_count, selectedDate } = this.state;
    
    if (error) {
        return <div>Error: {error.message}</div>;
      } 
    else if (!isLoaded) {
        return <div style={{"padding":"10px"}}><h3>Loading....</h3></div>;
      } 
    else {
      return (
                <div className='root' style={{"padding":"10px"}}>
                   <TextField variant="filled" style={{"padding":"10px"}}
                      label="Event Date"
                      format="yyyy-mm-dd"
                      type="date"
                      defaultValue={selectedDate}
                      onChange={this.handleDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  <TextField  label="By Event Category" onChange={this.handleEventCatChange} variant="filled" style={{"padding":"10px"}}/>
                  <TextField  label="By Event Type" onChange={this.handleEventTypeChange} variant="filled" style={{"padding":"10px"}}/>
                  <TextField  label="By Action" onChange={this.handleEventActionChange} variant="filled" style={{"padding":"10px"}}/>
                  <TextField  label="By Age" onChange={this.handleEventAgeChange} variant="filled" style={{"padding":"10px"}}/>
                  <SearchIcon fontSize='large' variant="filled" onClick={this.searchEvents}/>
                  <button onClick={this.onCancel}>Cancel</button>
                  <Paper className='paper'>
                    <TableContainer>
                      <Table className='table'
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table"
                      >
                        <TableHead style={{"backgroundColor":"#bab8b1"}}> 
                        <TableRow>
                          <TableCell style={{"width":"30%", "color": "#0097f1", "fontWeight": "bold"}}>Event ID</TableCell>
                          <TableCell style={{"width":"25%", "color": "#0097f1", "fontWeight": "bold"}}>Device ID</TableCell>
                          <TableCell style={{"width":"20%", "color": "#0097f1", "fontWeight": "bold"}}>Record ID</TableCell>
                          <TableCell style={{"width":"15%", "color": "#0097f1", "fontWeight": "bold"}}>Event Date</TableCell>
                          <TableCell style={{"width":"10%", "color": "#0097f1", "fontWeight": "bold"}}>TTL</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody style={{"backgroundColor":"#f2efe1"}}>
                          {items.map((item,index) => (
                            <TableRow hover
                            role = "button"
                            onClick={(event) => this.handleClick(event, item.EventID)}
                            style ={ index % 2? { background : "#e3dfde" }:{ background : "#f5edeb" }}>
                              <TableCell key={item.RecordID.toString()}>{item.EventID}</TableCell>
                              <TableCell>{item.DeviceID}</TableCell>
                              <TableCell>{item.RecordID}</TableCell> 
                              <TableCell>{item.EventDate}</TableCell>
                              <TableCell>{item.TTL}</TableCell> 
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer> 
                    <TablePagination
                      rowsPerPageOptions={[20]}
                      component="div"
                      rowsPerPage={20}
                      page={page}
                      onChangePage={this.onChangePage}
                      count={item_count}
                    /> 
                  </Paper>  
                </div>
            );
        }
    }    
}
export default Home