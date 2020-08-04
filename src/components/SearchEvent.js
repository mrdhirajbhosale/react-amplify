import React, { Component } from 'react'
import { API, Auth } from 'aws-amplify';
import './Home.css';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

class SearchEvent extends Component{
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
          deviceid: ''
        };      
     let a =  Auth.currentSession()
     console.log(a)          
    }
  async componentDidMount() {
    let params = {
            body: this.state.nextPage
          }      
    this.getData(params) 
  }
  getData(params){
    API.post('eventapi', '/events', params).then(res => res)
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
    console.log(newPage)
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
      console.log(this.state.previousPage[this.state.page-1])
      params = {
        body: {
          LastEvaluatedKey : this.state.previousPage[this.state.page-2],
          }
        } 
        console.log(params)
        this.setState({
          page: newPage
        });
        this.state.previousPage.pop()  
    }
    this.getData(params)
  };
  handleChange = event => {
    this.setState({ deviceid: event.target.value });
  };
  onPreviousPage= () => {
    console.log(this.state.previousPage)
    let params = {
      body: {LastEvaluatedKey : this.state.previousPage[this.state.page - 2]}
    } 
    this.state.previousPage.pop()   
    this.getData(params)
  }
  SearchEvent= () => {
    let params = {
        body: {
            TTL : this.state.deviceid,
          }
        } 
      console.log("search event", this.state.deviceid)
      API.post('eventapi', '/events/search', params).then(res => res)
      .then((result) => {
        if(result.code !== '10100'){
            console.log(result)
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
  render(){
    const { error, isLoaded, items, nextPage, page, item_count } = this.state;
    if (error) {
        return <div>Error: {error.message}</div>;
      } 
    else if (!isLoaded) {
        return <div style={{"padding":"10px"}}><h3>Loading....</h3></div>;
      } 
    else {
      return (
                <div className='root' style={{"padding":"10px"}}>
                  <lable>Device ID:  </lable>
                  <input type='text'  value={this.state.deviceid}
                    onChange={this.handleChange}/>
                  <button onClick={() => this.SearchEvent()}> Search</button>
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
                            <TableRow role="checkbox" style ={ index % 2? { background : "#e3dfde" }:{ background : "#f5edeb" }}>
                              <TableCell key={index.toString()}>{item.EventID}</TableCell>
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
export default SearchEvent