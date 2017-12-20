import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Tabs, { Tab } from 'material-ui/Tabs'
import Close from 'material-ui-icons/Close'
import { removeOpenRelation, removeAllOpenRelations } from '../../../actions/relations'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  tabs: {
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%',
    marginBottom: -17
  },
  buttonAuto: {
    color: theme.palette.primary[700],
    marginBottom: 17
  },
  tab: {
    color: theme.palette.primary[400]
  },
  tabSelected: {
    color: theme.palette.secondary[500]
  }
})

class CategoryItemDetailTabs extends Component {
  state = {
    tabTitles: []
  }

  handleChangeTab = (event, activeTab) => {
    this.props.handleChangeTab(activeTab, this.props.openRelations)
  }

  componentDidMount = () => {
    this.setState({
      tabTitles:[this.props.title]
    })
  }

  componentWillReceiveProps = nextProps => {
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = nextProps.openRelations.length
    if (oldNumOpenRelations !== newNumOpenRelations) {
      this.setState(prevState => ({
        tabTitles: [...prevState.tabTitles, nextProps.title]
      }))
    }
  }

  render = () => {
    const {
      editMode,
      fields,
      item,
      activeIndex,
      openRelations,
      updateItem,
      changeEditMode,
      removeAllOpenRelations,
      classes
    } = this.props
    const { tabTitles } = this.state
    return (
      <HeaderLayout
        operations={[
          {id:'close', icon:Close, onClick:removeAllOpenRelations}
        ]}
        hidden={openRelations.length < 2}
        secondaryToolbar
        secondaryToolbarHeight={48}
        contentToolbar={
          <Tabs
            value={activeIndex}
            onChange={this.handleChangeTab}
            classes={{
              root: classes.tabs,
              buttonAuto: classes.buttonAuto
            }}
            textColor="primary"
            indicatorColor="accent"
            fullWidth            
            scrollable
            scrollButtons="auto"
          >
            {tabTitles.map((title, index) =>
              <Tab
                key={index}
                label={title}
                disableRipple
                classes={{
                  rootPrimary: classes.tab,
                  rootPrimarySelected: classes.tabSelected
                }}
              />
            )}
          </Tabs>
        }
      >
        <div key={activeIndex}>
          <HeaderLayout
            title={tabTitles[activeIndex]}
            operations={[
              {id:'close', icon:Close, hidden:openRelations.length > 1, onClick:removeAllOpenRelations},
              {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => changeEditMode(true)},
              {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => changeEditMode(false)},
              {id:'check', icon:Check, right:true, hidden:!editMode, onClick:() => {
                this.formElement.dispatchEvent(new Event('submit'),{bubbles:false})
              }}
            ]}
          >
            <Form
              cols={12}
              view="detail"
              infoMode={!editMode}
              fields={fields}
              values={item}
              handleSubmit={updateItem}
              formRef={el => this.formElement = el}
            />
          </HeaderLayout>
        </div>
      </HeaderLayout>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  removeOpenRelation: () => dispatch(removeOpenRelation()),
  removeAllOpenRelations: () => dispatch(removeAllOpenRelations())
})

export default connect(null,mapDispatchToProps)(
  withStyles(styles)(CategoryItemDetailTabs)
)
