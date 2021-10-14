import React from 'react';
import DynamicTabs from '../configureModule/DynamicTabs';
import DeployDynamic from '../configureModule/DeployDynamic';
const Deploy = () => {
    return (
        <div>
            {/* test */}
            {/* <DynamicTabs /> */}
            <div class='container fluid'>
                <div class='row'>
                    <div class='col-sm-12' style={{ padding: 0 }}>
                        <DeployDynamic />

                    </div>
                </div>
            </div>

        </div>
    )
}
export default Deploy;