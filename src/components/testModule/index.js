import React from 'react';
import TestDynamic from '../configureModule/TestDynamic';
const TestModule = () => {
    return (
        <div>
            {/* test */}
            {/* <DynamicTabs /> */}
            <div class='container fluid'>
                <div class='row'>
                    <div class='col-sm-12' style={{ padding: 0 }}>
                        <TestDynamic />

                    </div>
                </div>
            </div>

        </div>
    )
}
export default TestModule;