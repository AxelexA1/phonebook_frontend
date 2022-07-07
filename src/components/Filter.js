// Tekstikenttä hakuehdon syöttämiseen
const Filter = ({newfilter, filterchange}) => {
    return(
    <div className="filter_div">    
        <input className="filter_input" value={newfilter} onChange={filterchange} placeholder="Search for contacts"/>
        <span class="focus-border"></span>
    </div>
    )
  }
export default Filter