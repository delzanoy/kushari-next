"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * Simple Test Page for View Transitions
 * 
 * Usage:
 * 1. Save this as: src/app/test-transitions/page.tsx
 * 2. Navigate to: http://localhost:3000/test-transitions
 * 3. Click the test buttons to see what works
 */

export default function TestTransitionsPage() {
  const router = useRouter();
  const [isSupported, setIsSupported] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const supported = typeof document !== 'undefined' && 'startViewTransition' in document;
    setIsSupported(supported);
    addResult(`Browser View Transitions: ${supported ? '✅ SUPPORTED' : '❌ NOT SUPPORTED'}`);
    
    if (!supported) {
      addResult('❌ Your browser does not support View Transitions API');
      addResult('💡 Try: Chrome 111+, Edge 111+, Safari 17.4+');
    }
  }, []);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Test 1: Basic navigation with transition
  const testBasicTransition = () => {
    addResult('🧪 Test 1: Basic transition to /wallets');
    
    if (!isSupported) {
      addResult('⚠️ Skipped - Browser does not support transitions');
      router.push('/wallets');
      return;
    }

    try {
      (document as any).startViewTransition(() => {
        addResult('✅ startViewTransition() called successfully');
        router.push('/wallets');
      });
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  // Test 2: Check if helpers.ts functions exist
  const testHelperFunctions = async () => {
    addResult('🧪 Test 2: Checking helper functions');
    
    try {
      const { navigateWithTransition, getWalletTransitionName } = await import('../wallets/helpers');
      addResult('✅ Helper functions imported successfully');
      
      const testName = getWalletTransitionName(123, 'icon');
      addResult(`✅ getWalletTransitionName(123, 'icon') = "${testName}"`);
      
      if (testName === 'wallet-123-icon') {
        addResult('✅ Function working correctly');
      } else {
        addResult('❌ Function returned unexpected value');
      }
    } catch (error) {
      addResult(`❌ Failed to import helpers: ${error}`);
      addResult('💡 Check if src/app/wallets/helpers.ts exists');
    }
  };

  // Test 3: Check CSS is loaded
  const testCSSLoaded = () => {
    addResult('🧪 Test 3: Checking if transition CSS is loaded');
    
    const testDiv = document.createElement('div');
    testDiv.style.viewTransitionName = 'test-element';
    document.body.appendChild(testDiv);
    
    const styles = getComputedStyle(testDiv);
    const hasTransitionName = testDiv.style.viewTransitionName === 'test-element';
    
    document.body.removeChild(testDiv);
    
    if (hasTransitionName) {
      addResult('✅ viewTransitionName style property works');
    } else {
      addResult('❌ viewTransitionName style property not working');
    }
  };

  // Test 4: Visual transition test
  const [boxPosition, setBoxPosition] = useState(0);
  
  const testVisualTransition = () => {
    addResult('🧪 Test 4: Visual transition test');
    
    if (!isSupported) {
      addResult('⚠️ Skipped - Browser does not support transitions');
      setBoxPosition(prev => prev === 0 ? 300 : 0);
      return;
    }

    try {
      (document as any).startViewTransition(() => {
        setBoxPosition(prev => prev === 0 ? 300 : 0);
        addResult('✅ Visual transition triggered');
      });
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1011] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[#F8FCFF] font-[Figtree] text-3xl mb-2">
          View Transitions Debug Page
        </h1>
        <p className="text-[#A3A7A8] mb-8">
          Run these tests to identify why transitions aren't working
        </p>

        {/* Browser Support Status */}
        <div className={`p-4 rounded-lg mb-8 ${isSupported ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
          <h2 className="text-xl font-semibold mb-2" style={{ color: isSupported ? '#64DEA7' : '#F37272' }}>
            {isSupported ? '✅ View Transitions Supported' : '❌ View Transitions Not Supported'}
          </h2>
          <p className="text-[#F8FCFF] text-sm">
            {isSupported 
              ? 'Your browser supports the View Transitions API. Tests should work.'
              : 'Your browser does not support View Transitions. Please use Chrome 111+, Edge 111+, or Safari 17.4+'}
          </p>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={testBasicTransition}
            className="px-6 py-3 bg-[#26C9C9] text-[#0E1011] rounded-lg font-medium hover:bg-[#20B0B0] transition-colors"
          >
            Test 1: Navigate to /wallets
          </button>
          
          <button
            onClick={testHelperFunctions}
            className="px-6 py-3 bg-[#26C9C9] text-[#0E1011] rounded-lg font-medium hover:bg-[#20B0B0] transition-colors"
          >
            Test 2: Check Helper Functions
          </button>
          
          <button
            onClick={testCSSLoaded}
            className="px-6 py-3 bg-[#26C9C9] text-[#0E1011] rounded-lg font-medium hover:bg-[#20B0B0] transition-colors"
          >
            Test 3: Check CSS Support
          </button>
          
          <button
            onClick={testVisualTransition}
            className="px-6 py-3 bg-[#26C9C9] text-[#0E1011] rounded-lg font-medium hover:bg-[#20B0B0] transition-colors"
          >
            Test 4: Visual Animation Test
          </button>
        </div>

        {/* Visual Test Box */}
        <div className="mb-8 p-4 bg-[#151819] rounded-lg border border-[#2E3435]">
          <h3 className="text-[#F8FCFF] font-semibold mb-4">Visual Test Box</h3>
          <div className="h-32 relative bg-[#0E1011] rounded">
            <div
              style={{
                viewTransitionName: 'test-box',
                marginLeft: `${boxPosition}px`,
              }}
              className="w-16 h-16 bg-[#26C9C9] rounded-lg transition-all duration-300"
            />
          </div>
          <p className="text-[#A3A7A8] text-sm mt-2">
            Click "Test 4" button. Box should smoothly slide left/right.
          </p>
        </div>

        {/* Test Results Console */}
        <div className="bg-[#000000] rounded-lg p-4 border border-[#2E3435]">
          <h3 className="text-[#F8FCFF] font-semibold mb-2">Test Results</h3>
          <div className="font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-[#A3A7A8]">Run tests to see results...</p>
            ) : (
              testResults.map((result, i) => (
                <div 
                  key={i} 
                  className={`py-1 ${
                    result.includes('✅') ? 'text-[#64DEA7]' : 
                    result.includes('❌') ? 'text-[#F37272]' : 
                    result.includes('⚠️') ? 'text-[#EFFF16]' :
                    'text-[#F8FCFF]'
                  }`}
                >
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-[#151819] rounded-lg border border-[#2E3435]">
          <h3 className="text-[#F8FCFF] font-semibold mb-2">What to Check:</h3>
          <ul className="text-[#A3A7A8] text-sm space-y-2">
            <li>✅ All tests should show green checkmarks</li>
            <li>❌ Any red X's indicate problems</li>
            <li>🧪 Test 1: Should navigate to /wallets with smooth transition</li>
            <li>🧪 Test 2: Should confirm helper functions exist</li>
            <li>🧪 Test 3: Should confirm CSS properties work</li>
            <li>🧪 Test 4: Box should smoothly slide, not jump instantly</li>
          </ul>
        </div>

        <style jsx>{`
          ::view-transition-old(test-box),
          ::view-transition-new(test-box) {
            animation-duration: 500ms;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </div>
    </div>
  );
}