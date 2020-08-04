import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

class EnhancedTable extends Component {
  
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
        };  
        let classes = useStyles();
        let [order, setOrder] = this.useState('asc');
        let [orderBy, setOrderBy] = this.useState('calories');
        let [selected, setSelected] = this.useState([]);
        let [page, setPage] = this.useState(0);
        let [dense, setDense] = this.useState(false);
        let [rowsPerPage, setRowsPerPage] = React.useState(5);               
    }
   handleRequestSort = (event, property) => {
    const isAsc = this.orderBy === property && this.order === 'asc';
    this.setOrder(isAsc ? 'desc' : 'asc');
    this.setOrderBy(property);
  };

   handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      this.setSelected(newSelecteds);
      return;
    }
    this.setSelected([]);
  };

   handleClick = (event, name) => {
    const selectedIndex = this.selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = this.newSelected.concat(this.selected, name);
    } else if (selectedIndex === 0) {
      newSelected =this. newSelected.concat(this.selected.slice(1));
    } else if (selectedIndex === this.selected.length - 1) {
      newSelected = newSelected.this.concat(this.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.this.concat(
        this.selected.slice(0, selectedIndex),
        this.selected.slice(selectedIndex + 1),
      );
    }

    this.setSelected(newSelected);
  };

   handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

   handleChangeRowsPerPage = (event) => {
    this.setRowsPerPage(parseInt(event.target.value, 10));
    this.setPage(0);
  };

   handleChangeDense = (event) => {
    this.setDense(event.target.checked);
  };

  isSelected = (name) => this.selected.indexOf(name) !== -1;

   emptyRows = this.rowsPerPage - Math.min(this.rowsPerPage, rows.length - this.page * this.rowsPerPage);
  render(){
    return (
        <div className={this.classes.root}>
          <Paper className={this.classes.paper}>
            <EnhancedTableToolbar numSelected={this.selected.length} />
            <TableContainer>
              <Table
                className={this.classes.table}
                aria-labelledby="tableTitle"
                size={this.dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={this.classes}
                  numSelected={this.selected.length}
                  order={this.order}
                  orderBy={this.orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {this.stableSort(rows, this.getComparator(this.order, this.orderBy))
                    .slice(this.page * this.rowsPerPage, this.page * this.rowsPerPage + this.rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = this.isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;
    
                      return (
                        <TableRow
                          hover
                          onClick={(event) => this.handleClick(event, row.name)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.name}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                          <TableCell align="right">{row.fat}</TableCell>
                          <TableCell align="right">{row.carbs}</TableCell>
                          <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                      );
                    })}
                  {this.emptyRows > 0 && (
                    <TableRow style={{ height: (this.dense ? 33 : 53) * this.emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={this.rowsPerPage}
              page={this.page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={this.dense} onChange={this.handleChangeDense} />}
            label="Dense padding"
          />
        </div>
      );
  }  
}
export default EnhancedTable