# PairScope

An offline, interactive closest-pair visualizer with Chinese step-by-step explanations. Download the repository and open **index.html** in your browser. No installation or server required.

### 分割线挑战

先猜一猜哪两个点最近。默认布局里，D 和 E 离分割线最近，但它们的高度相差很大。点击「下一步」，观察算法如何在中间的 strip 找到另一对点。你也可以拖动 D 或 E，再看看答案什么时候改变。

- 点击空白处添加点（最多 26 个），或生成随机点阵。
- 前后切换步骤，查看递归分割、子问题比较和跨线检查。
- 最短距离属于当前子问题。最后一步给出全局答案。

### Implementation

The solver presorts by both coordinates, carries the y-order through recursion, and scans each strip until the vertical gap reaches the current best distance. The geometric search takes O(n log n) time. The interface retains the trace for backward stepping.

Run the reference checks with Node.js: `node check.js`.
